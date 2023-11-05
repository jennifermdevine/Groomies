import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link, Route, Routes } from 'react-router-dom'

function Nav() {
    return (
      <div className="header">
        <Navbar>
          <Container>
            <Navbar><Link className="a" to="/">Groomies</Link></Navbar>
          </Container>
        </Navbar>
      </div>
    );
  }

  export default Nav;