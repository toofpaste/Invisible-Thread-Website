import React from 'react'
import logoPngBlk from '../images/logo_black.png'
import '../sceneElements/contactFormStyles.css';

export default function ContactFormElement() {
  return (
    <div id={'topLevel'}>
      <div id={'contact-form'} className={'panel-3d'}>

        <div className="nav">
          {/* <a href="#" className="menu-activator"><i className="ion-ios-more"></i></a>*/}
          {/* <img src={logoPngBlk} style={{ width: '250px' }} /> */}
          {/* <a href="#" className="white link"><i className="ion-ios-redo-outline"></i><i className="ion-ios-redo hidden"></i></a>*/}
        </div>
        <div className="container">
          <div className="inner">
            <div className="panel panel-left">
              <div className="panel-content">
                <div className="image-background">
                </div>
              </div>
            </div>
            <div className="panel panel-right">
              <div className="panel-content">
                <div className="form">
                  <h1>Let's chat!</h1>
                  <div className="group">
                    <input type="text" required />
                    <span className="highlight"></span>
                    <label>Your name</label>
                  </div>
                  <br />
                  <div className="group">
                    <input type="text" required />
                    <span className="highlight"></span>
                    <label>Your email</label>
                  </div>
                  <br />
                  <div className="group">
                    <input type="text" required />
                    <span className="highlight"></span>
                    <label>Message</label>
                  </div>
                  <br />
                  <a className="send-btn">Send</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="menu"></div>


      </div>
    </div>
  )
}



