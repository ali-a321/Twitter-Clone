const authHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (user && user.token) {
       return { Authorization: 'Bearer ' + user.token };
    } else {
      return {};
    }
  }

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
       return 'Bearer ' + user.token ;
    } else {
      return {};
    }
  }

  const authHeaderService = {
    getToken,
    authHeader
  };
  
  export default authHeaderService;