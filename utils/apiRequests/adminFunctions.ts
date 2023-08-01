// get all user API
export const getAllUsers = async (token: string) => {
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
      process.env.NEXT_PUBLIC_ALL_USERS,
      requestOptions,
    );
    const responseData = response.json();
    return responseData;
  } catch (error) {
    console.log("Get user error", error);
  }
};

// get managers API
export const getManagers = async (token: string) => {
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
      process.env.NEXT_PUBLIC_GET_MANAGERS,
      requestOptions,
    );
    const responseData = response.json();
    return responseData;
  } catch (error) {
    console.log("Get user error", error);
  }
};

// update user
export const updateUser = async (token: string, data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_UPDATE_USER}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("Update user error", error);
  }
};
