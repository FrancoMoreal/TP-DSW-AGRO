import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import backgroundImage from "../assets/images/homeImage.jpg";

interface Props {}

const Home = (props: Props) => {
  return (
    <div style={{ display: "flex", flexGrow: 1 }}>
      {/* <SideBar /> SideBar en la izquierda */}
      <Container
        style={{
          flexGrow: 1,
          padding: "16px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
           // Aplica el desenfoque a la imagen de fondo
        }}
        maxWidth="xl"
      >
        <Outlet /> {/* Aquí se renderizan las rutas hijas */}
      </Container>
    </div>
  );
};

export default Home;
