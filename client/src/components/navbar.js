import React from "react";
import { useState, useEffect} from "react";
import {UserOutlined} from "@ant-design/icons"
import { Row, Dropdown,} from "antd";
import { useNavigate } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";

const NavBar = (props) =>{
  const navigate = useNavigate()
  const [schedule,setSchedule] = useState(false)
  const useScrollOpacity = () => {
  const [opacity, setOpacity] = useState(0);
    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 0) {
          // Scrolling down
          setOpacity(1);
        } else {
          // Scrolling back to the top
          setOpacity(0);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    return opacity;
  };
  const opacity = useScrollOpacity()
  const loggedIn = () =>{
    if(localStorage.getItem('loggedIn')){
      props.setLoggedIn(true)
    }
  }


  const items = [
    {
      key: '1',
      label: (
        <div>
          Change password 
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={logOut} >
          Log Out
        </div>
      ),
    }
  ];


  const options = [
    {
      key: '3',
      label: (
           <div><NavLink to={'/commerce'} style={{textDecoration: 'none'}}>
            Pay with BTC Eth and more
           </NavLink>
           </div> 
      ),
    },
    {
      key: '4',
      label: (
        <div> <NavLink to={'/pay'} style={{textDecoration: 'none'}}>
        pay with card or wallet
        </NavLink>
        </div>
      ),
    }
  ];

  
  async function logOut(){

    if(localStorage.getItem("jwt")){
      const jwt = localStorage.getItem("jwt")
      let res = await fetch('http://localhost:4000/logout', {
        method: 'POST',
            headers: {
              'Authorization': `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            }
          })
    
          if(res.ok){
            props.notification("logout")
            localStorage.removeItem('loggedIn')
            localStorage.removeItem('jwt')
            localStorage.removeItem('name')
            props.setLoggedIn(false)
            navigate('/')
          }
  }else{
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('wallet')
    props.setLoggedIn(false)
    props.notification("logout")
    navigate('/')
  }

}


useEffect(()=>{
loggedIn()
},[props.loggedIn])

return(
  <div data-collapse="medium" data-animation="default" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav">
        <div className="fill-navbar"  style={{opacity: `${opacity}`}}></div>
        <div className="container w-container">
          <a href="/" id="first_element" className="brand nav-btn w-nav-brand"><img src="https://uploads-ssl.webflow.com/6421d264d066fd2b24b91b20/6421d264d066fd6711b91c04_tempest_logo_spiral_with_coin.png" loading="eager" alt="" className="logo-icon-2"/><img src="https://uploads-ssl.webflow.com/6421d264d066fd2b24b91b20/6421d264d066fdff16b91b5b_tempest-logo-name.svg" loading="lazy" alt="" className="logo-name-2"/></a>
          <div className="account-menu-container">
            <div className="parent-navbar">
              <div className="div"></div>
              <nav role="navigation" className="nav-menu w-nav-menu">
                <NavLink to={'/dashboard'}>
                <a  className="nav-link w-inline-block">
                  <div className="nav-text-1">Dashboard</div>
                  <div className="nav-text-2">Dashboard</div>
                </a>
                </NavLink>
                <NavLink to={'/dashboard'}>
                <a  aria-current="page" className="nav-link w-inline-block w--current">
                  <div className="nav-text-1">Staking</div>
                  <div className="nav-text-2">Staking</div>
                  <p style={{fontSize:'10px'}}>Coming Soon</p>
                </a>
                </NavLink>
                <NavLink to={'/bonding'}>
                <a  className="nav-link w-inline-block">
                  <div className="nav-text-1">Bonding</div>
                  <div className="nav-text-2">Bonding</div>
                  <p style={{fontSize:'10px'}} >Coming Soon</p>
                </a>
                </NavLink>
                <NavLink onClick={(e)=>{
                  e.preventDefault()
                  setSchedule(!schedule)
                }} to={'/call'}>
                <a className="nav-link w-inline-block">
                 {schedule? <p>Contact Greg@tmpst.io </p> :<>
                  <div className="nav-text-1">Schedule a call</div>
                  <div className="nav-text-2">Schedule a call</div>
                  </>}
                </a>
                </NavLink>
                <NavLink to={localStorage.getItem('loggedIn')===null? '/register-pay':'/pay'}>
                <a className="nav-link hide-desktop w-inline-block">
                  <div className="nav-text-1">Schedule a call</div>
                  <div className="nav-text-2">Buy Now</div>
                </a>
                </NavLink>
              </nav>
              <div className="elfsight-app-fffafc38-590b-43ee-b545-41bdc42f1c1d"></div>
              <div className="flex-buttons">
                <button href="#" className="button-1 outline hide-for-now w-inline-block">
                  <div>Login</div>
                  </button>
                  <div className="right-two-sign-start vert">
                    {props.loggedIn?
                      <Dropdown trigger={["click"]} overlayStyle={{zIndex:"99999"}}
                      menu={{
                        items:options,
                       }}
                       placement="bottom"
                       > 
                    <div className="button-div nav-btn">
                      <div className="button-1 w-inline-block">
                        <div><img src="https://uploads-ssl.webflow.com/6421d264d066fd2b24b91b20/6446ac737eb6c0523ebcdbef_coin-small.png" loading="lazy" alt="" className="coin-button-image"/></div>
                        <div>Buy Now</div>
                      </div>
                    </div> 
                      </Dropdown>
                    :
                    <></>}
                    <div className="obsidian-div center">
                      <div className="grey-text _10-pt">Verified by</div>
                      <div className="obsidian-svg smaller w-embed"><svg  viewBox="0 0 258 59" fill="none" height="100%" xmlns="http://www.w3.org/2000/svg">
                          <path  fillRule="evenodd" clipRule="evenodd" d="M26.1081 9.53891L31.1446 12.4498V25.1438L42.133 31.4857V37.2975L37.0815 40.2134L26.098 33.8715L15.1196 40.2084L10.0781 37.2975V31.4757L21.0665 25.1337V12.4498L26.1081 9.53891Z" fill="black"></path>
                          <path fillRule="evenodd" clipRule="evenodd" d="M0 37.2975V12.995L13.054 5.45765L21.0565 0.831213V12.4698L18.0806 14.1854L10.0781 18.8118V31.5007L0 37.2975ZM47.1646 46.0302L39.1622 50.6517L26.1081 58.189L13.0591 50.6517L5.05657 46.0252L15.1347 40.2084L18.1056 41.924L26.1081 46.5504L34.1106 41.924L37.0715 40.2134L47.1646 46.0302ZM31.1597 0.811218L39.1622 5.43765L52.2112 12.995V37.3275L42.1331 31.5007V18.7918L34.1306 14.1654L31.1297 12.4498L31.1597 0.811218Z" fill="black"></path>
                          <path  d="M238.284 40.2034H231.707V13.9103H258V40.2034H251.428V20.4973H238.284V40.2034ZM221.649 27.0494L211.791 33.6264H221.649V27.0494ZM201.933 13.9103H228.226V40.2034H201.933V33.6264L221.649 20.4973H201.933V13.9103ZM198.617 13.9103V40.2034H192.02V13.9103H198.617ZM182.312 20.4973H169.172V33.6364H182.312V20.4973ZM188.889 7.34325V40.2034H162.595V13.9103H182.312V7.33324L188.889 7.34325ZM159.134 13.9203V40.2034H152.562V13.9103L159.134 13.9203ZM130 23.7683H149.716V40.2034H123.423V33.6264H143.139V30.3454H123.423V13.9103H149.716V20.4973H130V23.7683ZM113.835 20.4973H100.701V33.6364H113.835V20.4973ZM100.701 7.34325V13.9203H120.417V40.2034H94.1192V7.33324L100.701 7.34325ZM84.4862 20.4973H71.3421V33.6364H84.4862V20.4973ZM91.0632 13.9203V40.2034H64.7601V13.9103L91.0632 13.9203Z" fill="black"></path>
                        </svg></div>
                    </div>
                  </div>
                  <Dropdown trigger={["click"]} overlayStyle={{zIndex:"99999"}}
                     menu={{
                          items,
                     }}
                     placement="bottom"
                    >   
                  <Row>
                    <UserOutlined  style={{ fontSize:'30px',marginRight:"10px",marginLeft:"20px"}}/>
                  </Row>
                    </Dropdown>
                </div>
              </div>
            <div data-w-id="7ff3046a-67f7-2f70-a933-d081bc90ae22" className="menu-button-1 w-nav-button">
              <div data-is-ix2-target="1" className="menu-lottie-button" data-w-id="7ff3046a-67f7-2f70-a933-d081bc90ae23" data-animation-type="lottie" data-src="https://uploads-ssl.webflow.com/6421d264d066fd2b24b91b20/6421d264d066fd8cf8b91b8a_menu-button-lottie.json" data-loop="0" data-direction="1" data-autoplay="0" data-renderer="svg" data-default-duration="0.875875951685588" data-duration="0"></div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default NavBar