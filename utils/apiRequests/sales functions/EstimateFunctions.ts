// get estimate
export const getEstimates = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GET_ESTIMATES}`, {
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
export const createEstimate = async (token: string, data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CREATE_ESTIMATE}`, {
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
export const updateEstimate = async (token: string, data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_UPDATE_ESTIMATE}`, {
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
