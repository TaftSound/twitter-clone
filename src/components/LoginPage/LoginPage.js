import PageLayout from "../PageLayout/PageLayout"


const LoginPage = (props) => {

  return (
    <div className="home-page">
      <PageLayout userName="Guest" centerContent={[
        <div></div>
      ]}/>
    </div>
  )
}

export default LoginPage