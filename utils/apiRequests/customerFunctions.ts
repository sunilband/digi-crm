// get tasks
export const getCustomers = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GET_CUSTOMERS}`, {
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
export const createCustomer = async (token: string, data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CREATE_CUSTOMER}`, {
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

//   update task
export const updateCustomer = async (token: string, data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_UPDATE_CUSTOMER}`, {
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
