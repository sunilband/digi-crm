// get proposal
export const getProposals = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GET_PROPOSALS}`, {
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
export const createProposal = async (token: string, data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CREATE_PROPOSAL}`, {
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
export const updateProposal = async (token: string, data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_UPDATE_PROPOSAL}`, {
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
