
import Banner from "@/components/home/Banner";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import GenderCategoryList from "@/components/home/GenderCategoryList";
import ProductSlider from "@/components/home/ProductSlider";
import RatingSlider from "@/components/home/RatingSlider";
import ShopByBrandsSlider from "@/components/home/ShopByBrandsSlider";
import VideoSection from "@/components/home/VideoSection";
import Container from "@/components/shared/Container";
// import { getBrands, getCategories, getFeaturedMenus, getMenus, getProductByCategory, getProducts, getReviews, getTeamMembers, getVideos } from "@/utils/actions";
import { getBrands, getCategories, getFeaturedMenus, getHeroTitle, getMenus, getProductByCategory, getProducts, getReviews, getRibbons, getSiteVideos, getTeamMembers, getVideos } from "@/utils/actions";
import TeamSlider from "@/components/home/TeamSlider";
import RibbonMarquee from "@/components/home/RibbonMarquee";
import HeroVideo from "@/components/home/HeroVideo";
import FilmSection from "@/components/home/FilmSection";
import FeatureItems from "@/components/home/FeatureItems";
import WelcomeSection from "@/components/home/WelcomeSection";
import AccessoriesSlider from "@/components/home/AccessoriesSlider";
import OutletsSection from "@/components/home/OutletsSection";
import NestedCategoryGrid from "@/components/home/NestedCategoryGrid ";


const baseUrl = process.env.BASE_URL || "https://admin.lukazshop.com";


export default async function Home() {
  const products = await getProducts();
  const brands = await getBrands();
  const reviews = await getReviews()
  const categories = await getCategories()
  const featureItems = await getProductByCategory(91)
  const videos = await getVideos();
  const siteVideos = await getSiteVideos();
  const heroTitle = await getHeroTitle();
  const ribbons = await getRibbons();
  const teamMembers = await getTeamMembers();
  const categoryTree = await getFeaturedMenus();

  // const reviews=await getReviews();



  return (
    <div className="">

      {/* <TopBanner /> */}
      {/* <Banner/> */}
      {/* <RibbonMarquee ribbons={ribbons} /> */}
      {/* <VideoSection video={videos[0]}/> */}
      {/* <VideoSection video={videos[0]} uploaded={siteVideos?.hero} /> */}
      <HeroVideo video={videos[0]} uploaded={siteVideos?.hero} heroTitle={heroTitle} />
      <div id="after-hero">
        <RibbonMarquee ribbons={ribbons} />
      </div>
      <Container>
        {/* <Banner/> */}
        <WelcomeSection />
        {/* <NestedCategoryGrid /> */}
        <ProductSlider products={products?.data} />
      </Container>

      <CategoriesGrid categoryTree={categoryTree} />

      <Container>
        {/* <ShopByBrandsSlider brands={brands} /> */}
      {/* featured Items/ best item */}
       {/* <FeatureItems featureItems={featureItems?.data} /> */}
      {/* {
        featureItems?.data?.length > 0  &&
      <FeatureItems featureItems={featureItems?.data} />

      } */}
       
        {/* <AccessoriesSlider /> */}

      </Container>

      {/* <VideoSection video={videos[1]} /> */}
      {/* <VideoSection video={videos[1]} uploaded={siteVideos?.bottom} /> */}
      <FilmSection video={videos[1]} uploaded={siteVideos?.bottom} />


      <Container>
        <TeamSlider members={teamMembers} />
      </Container>

      <OutletsSection/>

      <Container>
        <RatingSlider reviews={reviews?.data} />
      </Container>



    </div>
  );
}
