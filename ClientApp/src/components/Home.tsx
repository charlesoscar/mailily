import * as React from 'react';
import { connect } from 'react-redux';

const Home = () => (
  <div>
    <h1>Welcome to Mailily!</h1>
    <p>This app is built with:</p>
    <ul>
      <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a></li>
      <li><a href='https://facebook.github.io/react/'>React</a> and <a href='https://redux.js.org/'>Redux</a></li>
      <li><a href='http://getbootstrap.com/'>Bootstrap</a></li>
    </ul>
    <p>This app features</p>
    <ul>
      <li><strong>Find email-addresses based on any given website</strong></li>
      <li><strong>Proper state management, saves all your searches</strong></li>
      <li><strong>Persisted storage</strong></li>
    </ul>
  </div>
);

export default connect()(Home);
