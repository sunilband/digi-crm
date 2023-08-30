// @ts-nocheck
// signup user API
export const userSignup = async (data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_REGISTER_USER}`, {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("signup error", error);
  }
};

// signup Admin API
export const adminSignup = async (data: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_REGISTER_USER}`,
      {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("signup error", error);
  }
};

// login user API
export const userLogin = async (data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LOGIN_USER}`, {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("Login error", error);
  }
};

// get user API
export const getUser = async (token: string) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    // @ts-ignore
    const response = await fetch(
      process.env.NEXT_PUBLIC_USER_INFO,
      requestOptions,
    );
    const responseData = response.json();
    return responseData;
  } catch (error) {
    console.log("Get user error", error);
  }
};
