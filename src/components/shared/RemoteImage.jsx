"use client"

import { useEffect, useRef, useState } from "react"
import {
  getImageUrl,
  getFallbackImageUrl,
  PLACEHOLDER_IMAGE,
} from "@/utils/helpers"

/**
 * Image that walks a chain of sources: the configured image host first, then
 * the fallback host, then the local placeholder. Each source is tried once, so
 * a missing file cannot loop.
 *
 * In local dev the two hosts cover each other: production holds nearly every
 * upload, while images added through the local admin exist only on localhost.
 *
 * `type` is the upload folder — "products", "category", "brand", "branch", …
 */
export default function RemoteImage({
  type,
  path,
  alt,
  className,
  loading = "lazy",
  ...rest
}) {
  const buildChain = () =>
    [getImageUrl(type, path), getFallbackImageUrl(type, path), PLACEHOLDER_IMAGE]
      .filter(Boolean)
      // Drop duplicates so the same URL is never requested twice.
      .filter((url, i, all) => all.indexOf(url) === i)

  const [chain, setChain] = useState(buildChain)
  const [step, setStep] = useState(0)
  const imgRef = useRef(null)

  // Restart the chain whenever the image changes.
  useEffect(() => {
    setChain(buildChain())
    setStep(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, path])

  // The markup is server-rendered, so the browser requests the first source
  // while parsing the HTML — before React hydrates and attaches onError. An
  // image that already failed by then would never fire the event, so check its
  // state directly once the element is live.
  useEffect(() => {
    const node = imgRef.current
    if (!node) return

    // complete && naturalWidth === 0 means the fetch finished and failed.
    if (node.complete && node.naturalWidth === 0) {
      setStep(prev => (prev + 1 < chain.length ? prev + 1 : prev))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, step])

  // Advance to the next source. Guarded so a repeated error cannot run past
  // the end of the chain.
  const handleError = () => {
    setStep(prev => (prev + 1 < chain.length ? prev + 1 : prev))
  }

  return (
    <img
      ref={imgRef}
      src={chain[step]}
      alt={alt ?? ""}
      loading={loading}
      onError={handleError}
      className={className}
      {...rest}
    />
  )
}
