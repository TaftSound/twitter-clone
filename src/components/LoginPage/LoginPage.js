import Header from "../Header/Header"
import PageLayout from "../PageLayout/PageLayout"


const LoginPage = (props) => {

  return (
    <div className="home-page">
      <PageLayout userName={null} centerContent={[
        <Header searchBar={true} 
                defaultTab="For you" 
                tabsArray={["For you", "Trending", "News", "Sports", "Entertainment"]}>
        </Header>
      ]}/>
    </div>
  )
}

export default LoginPage