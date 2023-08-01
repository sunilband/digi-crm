// get tasks
export const getItems = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GET_ITEMS}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      //     userID:data
      // }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("Update user error", error);
  }
};

//   create task
export const createItem = async (token: string, data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CREATE_ITEM}`, {
      method: "POST",
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

// get tasks
export const getGroups = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GET_GROUPS}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      //     userID:data
      // }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("Update user error", error);
  }
};

//   create task
export const createGroup = async (token: string, data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CREATE_GROUP}`, {
      method: "POST",
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
