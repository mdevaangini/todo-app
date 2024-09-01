export function User() {
  const users = [
    {
      name: "gaurav",
      age: 24,
      gender: "male",
      hobbies: ["traveling", "music"],
      address: { city: "hyderabad", country: "india" },
    },
    {
      name: "devaangini",
      age: 25,
      gender: "female",
      hobbies: ["cooking", "reading"],
      address: { city: "mumbai", country: "india" },
    },
    {
      name: "ravi",
      age: 26,
      gender: "male",
      hobbies: ["ironing", "reading"],
      address: { city: "delhi", country: "india" },
    },
  ];

  /**
   * Return all users
   */
  function getAllUsers() {
    return users;
  }

  /**
   * Return user by id
   */
  function getUserById(id) {
    const user = users.find((item) => item.id === id);
    return user;
  }

  // /**
  //  * Return users above given age
  //  */
  function getUsersAboveAge(age) {
    const aboveAge = users.filter((item) => {
      return item.age > age;
    });
    return aboveAge;
  }

  // /**
  //  * Return all the users with given hobby
  //  */
  function getUsersByHobby(hobby) {
    const byHobby = users.filter((item) => {
      return item.hobbies.includes(hobby);
    });

    return byHobby;
  }

  // /**
  //  * Return all the users with given gender
  //  */
  function getUsersByGender(gender) {
    const givenGender = users.filter((item) => {
      return item.gender === gender;
    });

    return givenGender;
  }

  // /**
  //  * Return all the users from given city
  //  */
  function getUsersByCity(city) {
    const givenCity = users.filter((item) => {
      return item.address.city.includes(city);
    });
    return givenCity;
  }

  // /**
  //  * Check if all users above given age
  //  */
  function areAllUsersAboveAge(age) {
    const isAboveAge = users.every((item) => item.age > age);
    return isAboveAge;
  }

  // /**
  //  * Check if all users have given hobby
  //  */
  function areAllUsersHaveHobby(hobby) {
    const isGivenHobbby = users.every((item) => {
      return item.hobbies.includes(hobby);
    });
    return isGivenHobbby;
  }

  // /**
  //  * Check if there is any user from given city
  //  */
  function isAnyUserFromCity(city) {
    const isAnyUser = users.some((item) => {
      return item.address.city === city;
    });
    return isAnyUser;
  }

  // /**
  //  * Calculate the sum of ages of all users
  //  */
  function calculateAgeSum() {
    const sumAges = users.reduce((acc, item) => {
      return acc + item.age;
    }, 0);
    return sumAges;
  }

  // /**
  //  * Get all the hobbies of all users that are available
  //  * eg: ['traveling', 'music', 'cooking', 'reading', any other hobby]
  //  */
  function getAllHobbies() {
    const hobbiesAvailable = users.reduce((acc, item) => {
      // return acc.concat(item.hobbies);
      return [...acc, ...item.hobbies];
    }, []);
    return hobbiesAvailable;
  }
  // /**
  //  * Get the count of all the hobbies of all users that are available
  //  */
  function getAllHobbiesCount() {
    const totalHobbies = users.reduce((acc, item) => {
      return acc + item.hobbies.length;
    }, 0);
    return totalHobbies;
  }
}

function useTodo() {
  const [todos, setTodos] = useSTate([]);

  const addTodo = (title) => {
    const todo = {
      title: title,
      id: Date.now(),
      timeStamp: Date.now(),
      completed: false,
    };

    const updateTodo = [...todos, todo];
    setTodos(updateTodo);
  };

  const deleteTo = (id) => {
    const updatedTodo = todos.filter((item) => {
      return item.id !== id;
    });

    setTodos(updatedTodo);
  };

  const update = (todo) => {
    const updatedTodo = todos.map((item) => {
      if (item.id === todo.id) return todo;
      else return item;
    });

    setTodos(updatedTodo);
  };
}
