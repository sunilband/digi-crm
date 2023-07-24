export type Payment = {
    _id: string
    taskName: string

    taskDescription: string

    priority:"Low" |
    "Medium" |
    "High" |
    "Urgent" 

    status?: "Not Started" |
    "In Progress" |
    "Testing" |
    "Awaiting Feedback" |
    "Complete" 

    tags?: string[]

    assignedBy: {
        name: string,
        id: string
      },

    assignedTo: {
        name: string,
        id: string
      },

    assignedTime: Date | string

    startDate?: Date | string
    dueDate: Date | string
    __v: number | string
  }


    

    
  