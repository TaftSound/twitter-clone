import { SmallMenuButton } from "./SmallMenuButton"

const BackButton = (props) => {
  return (
    <SmallMenuButton className={props.className} onClick={props.onClick} path='M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z'></SmallMenuButton>
  )
}

export default BackButton