OAuth2.adapter('quizlet', {
  /**
   * @return {URL} URL to the page that returns the authorization code
   */
  
  authorizationCodeURL: function(config) {
    return ('https://quizlet.com/authorize/'+
            '?response_type=code&client_id='+
            config.clientId+
            '&scope=read&state='+
            "VERYSECRETANDgeheim");  // seriously, how do you do this
            // w/o using the local storage thing
  },

  /**
   * @return {URL} URL to the page that we use to inject the content
   * script into
   */
  redirectURL: function(config) {
    return 'https://quizlet.com/robots.txt';
  },

  /**
   * @return {String} Authorization code for fetching the access token
   */
  parseAuthorizationCode: function(url) {
    // Make sure it has the correct 'state' or random string (same as sent previously)
    if(url.match(/[&\?]state=([^&]+)/)[1] != "VERYSECRETANDgeheim") {
        throw "Incorrect state!  This is a security problem.";
    } else
        return url.match(/[&\?]code=([^&]+)/)[1];
  },

  /**
   * @return {URL} URL to the access token providing endpoint
   */
  accessTokenURL: function() {
    return 'https://api.quizlet.com/oauth/token';
  },

  /**
   * @return {String} HTTP method to use to get access tokens
   */
  accessTokenMethod: function() {
    return 'POST';
  },

  /**
   * @return {Object} The payload to use when getting the access token
   */
  accessTokenParams: function(authorizationCode, config) {
    return {
      code: authorizationCode,
      redirect_uri: this.redirectURL(config),
      grant_type: 'authorization_code'
    };
  },

  /**
   * @return {Object} Object containing accessToken {String},
   * refreshToken {String} and expiresIn {Int}
   */
  parseAccessToken: function(response) {
    var obj = JSON.parse(response);
    return {
      accessToken: obj.access_token,
      expiresIn: obj.expires_in,
      login: obj.user_id
    };
  }
});
