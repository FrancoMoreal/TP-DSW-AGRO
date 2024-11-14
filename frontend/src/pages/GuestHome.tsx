
import backgroundImage from '../assets/images/guestHomeImage.jpg';

export const GuestHome = () => {
  return (
    <div style={{ width: "100%", backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}></div>
  )
}
