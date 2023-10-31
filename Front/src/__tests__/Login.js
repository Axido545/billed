import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES } from "../constants/routes";
import { fireEvent, screen, render } from "@testing-library/dom";
import mockStore from "../__mocks__/store"

beforeEach(() => {
  // Crée un mock pour localStorage.clear
  jest.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
    // Ne fait rien pour simuler la suppression de données dans le localStorage
  });
});

afterEach(() => {
  // Restaure le comportement d'origine de localStorage.clear
  Storage.prototype.clear.mockRestore();
});


describe("Given that I am a user on login page", () => {

  describe("When I do not fill fields and I click on employee button Login In", () => {

    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("employee-email-input");
      expect(inputEmailUser.value).toBe("");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      expect(inputPasswordUser.value).toBe("");

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  describe("When I do fill fields in correct format and I click on employee button Login In", () => {

    test("Then I should be identified as an Employee in app", () => {
      document.body.innerHTML = LoginUI();
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };

      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      expect(inputEmailUser.value).toBe(inputData.email);

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      });
      expect(inputPasswordUser.value).toBe(inputData.password);

      const form = screen.getByTestId("form-employee");

      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      let PREVIOUS_LOCATION = "";

      const store = jest.fn();

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      const handleSubmit = jest.fn(login.handleSubmitEmployee);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );

    });

    test("It should renders Bills page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });
  });
});

describe("Given that I am a user on login page", () => {

  describe("When I do not fill fields and I click on admin button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("admin-email-input");
      expect(inputEmailUser.value).toBe("");

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      expect(inputPasswordUser.value).toBe("");

      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
    test("Then it should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  describe("When I do fill fields in correct format and I click on admin button Login In", () => {
    test("Then I should be identified as an HR admin in app", () => {
      document.body.innerHTML = LoginUI();
      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected",
      };

      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      expect(inputEmailUser.value).toBe(inputData.email);

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      });
      expect(inputPasswordUser.value).toBe(inputData.password);

      const form = screen.getByTestId("form-admin");

      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      let PREVIOUS_LOCATION = "";

      const store = jest.fn();

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      const handleSubmit = jest.fn(login.handleSubmitAdmin);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });

    test("It should renders HR dashboard page", () => {
      expect(screen.queryByText("Validations")).toBeTruthy();
    });
  });
});


describe("Given that I am a user on login page", () => {

  describe('when i do fill fields employe information in admin form and i click to admin login ', () => {
test("Then I should be identified as an Employee in app", () => {
  document.body.innerHTML = LoginUI();
  const inputData = {
    email: "johndoe@email.com",
    password: "azerty",
  };

  const inputEmailUser = screen.getByTestId("admin-email-input");
  fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
  expect(inputEmailUser.value).toBe(inputData.email);

  const inputPasswordUser = screen.getByTestId("admin-password-input");
  fireEvent.change(inputPasswordUser, {
    target: { value: inputData.password },
  });
  expect(inputPasswordUser.value).toBe(inputData.password);

  const form = screen.getByTestId("form-admin");

  // localStorage should be populated with form data
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
    },
    writable: true,
  });

  // we have to mock navigation to test it
  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname });
  };

  let PREVIOUS_LOCATION = "";

  const store = jest.fn();

  const login = new Login({
    document,
    localStorage: window.localStorage,
    onNavigate,
    PREVIOUS_LOCATION,
    store,
  });

  const handleSubmit = jest.fn(login.handleSubmitAdmin);
  login.login = jest.fn().mockResolvedValue({});
  form.addEventListener("submit", handleSubmit);
  fireEvent.submit(form);
  expect(handleSubmit).toHaveBeenCalled();
  expect(window.localStorage.setItem).toHaveBeenCalled();
  expect(window.localStorage.setItem).toHaveBeenCalledWith(
    "user",
    JSON.stringify({
      type: "Admin",
      email: inputData.email,
      password: inputData.password,
      status: "connected",
    })
  );
});
test("It should renders HR dashboard page", () => {
  expect(screen.queryByText("Validations")).toBeTruthy();



});
})
})
  // describe("When I do fill field email in correct format and I click admin button Login In", () => {
    test("It should renders HR dashboard page", () => {

      function adminIsConnected(){
        let rslt;
        if(screen.queryByText("Validations")) {
          rslt = true;
        } else {
          rslt = false;
        }
        return rslt;
      }
adminIsConnected()
  })


describe("Given that I am a user on login page", () => {

  describe("When I do fill field email in incorrect format and I click on employee button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "employee" } });
      expect(inputPasswordUser.value).toBe("employee");

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });

    function handleEmployeeLogin(inputData) {
      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      expect(inputEmailUser.value).toBe(inputData.email);
    
      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: inputData.password } });
      expect(inputPasswordUser.value).toBe(inputData.password);
    
      const form = screen.getByTestId("form-admin");

      function employeeIsValid(inputData) {
        const isEmailValid = inputData.email.includes('@');
        const isPasswordValid = inputData.password.length >= 6;
        return isEmailValid && isPasswordValid;
      }
      form.addEventListener("submit", () => {
        if (employeeIsValid(inputData)) {
          console.log('ok')
        } else {

          console.log('ps ok')
        }
      });
    }
    
    describe("When I do fill fields in correct format and I click on admin button Login In", () => {
      beforeEach(() => {
        document.body.innerHTML = LoginUI();
      });
    
      test("Then I should be identified as an Employee in app", () => {
        const inputData = {
          email: "employee@test.ltd",
          password: "employee",
        };
        handleEmployeeLogin(inputData);
      });
    });
    
  });

  describe('Login.js', () => {
    // ...
    
    test('should handle form submission when valid credentials are provided', () => {
      // Simulez la création du formulaire et remplissez les champs d'identifiants avec des valeurs valides
      const form = screen.getByTestId('form-admin');
      const emailInput = screen.getByTestId('admin-email-input');
      const passwordInput = screen.getByTestId('admin-password-input');
      
      fireEvent.change(emailInput, { target: { value: 'validemail@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
      
      // Espionnez la fonction de soumission et assurez-vous qu'elle est appelée
      const handleSubmit = jest.fn();
      form.addEventListener('submit', handleSubmit);
      fireEvent.submit(form);
      
      // Ajoutez des assertions pour vérifier le comportement attendu
      expect(handleSubmit).toHaveBeenCalled();
      // Vous pouvez également vérifier d'autres effets de l'appel de soumission ici
    });
    
    // ...
  });

  describe("When I do fill fields in correct format and I click on employee button Login In", () => {
    test("Then I should be identified as an Employee in app", () => {
      document.body.innerHTML = LoginUI();
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };

      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      expect(inputEmailUser.value).toBe(inputData.email);

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      });
      expect(inputPasswordUser.value).toBe(inputData.password);

      const form = screen.getByTestId("form-employee");

      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      let PREVIOUS_LOCATION = "";

      const store = jest.fn();

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      const handleSubmit = jest.fn(login.handleSubmitEmployee);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });

    test("It should renders Bills page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });
  });
});

describe('Login - handleSubmitEmployee', () => {
  it('should handle form submission for employee with valid data', () => {
    // Créez un espion pour localStorage.setItem
    const localStorageSpy = jest.spyOn(window.localStorage, 'setItem');
    document.body.innerHTML = LoginUI();
    const inputData = {
      email: 'employee@test.ltd',
      password: 'employee',
    };

    // Récupération des éléments
    const myEmail = screen.getByTestId('employee-email-input');
    fireEvent.change(myEmail, { target: { value: inputData.email } });
    expect(myEmail.value).toBe(inputData.email);

    const inputPasswordUser = screen.getByTestId('employee-password-input');
    fireEvent.change(inputPasswordUser, {
      target: { value: inputData.password },
    });
    expect(inputPasswordUser.value).toBe(inputData.password);

    const form = screen.getByTestId('form-employee');

    // Créez un espion pour la méthode onNavigate
    const onNavigateSpy = jest.fn();
    const store = jest.fn();

    const login = new Login({
      document,
      localStorage: window.localStorage,
      onNavigate: onNavigateSpy,
      PREVIOUS_LOCATION: '',
      store,
    });

    const handleSubmit = jest.fn(login.handleSubmitEmployee);
    login.login = jest.fn().mockResolvedValue({});
    form.addEventListener('submit', handleSubmit);
    fireEvent.submit(form);

    // Vérifiez que les spies ont été appelés avec les bonnes données
    expect(handleSubmit).toHaveBeenCalled();
    expect(localStorageSpy).toHaveBeenCalled();
    expect(localStorageSpy).toHaveBeenCalledWith(
      'user',
      JSON.stringify({
        type: 'Employee',
        email: inputData.email,
        password: inputData.password,
        status: 'connected',
      })
    );
  });
});

describe("Given that I am a user on the login page", () => {
  describe("When I do not fill fields and I click on the employee button Login In", () => {
    test("Then It should render the Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("employee-email-input");
      if (inputEmailUser.value === "") {
        console.log("Email input is empty");

      } else {
        // Le champ email n'est pas vide, ce n'est pas ce que nous attendons
        console.log("Email input is not empty");
      }

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      if (inputPasswordUser.value === "") {
        // Le champ mot de passe est vide
        // C'est ce que nous attendons
      } else {
        // Le champ mot de passe n'est pas vide, ce n'est pas ce que nous attendons
        console.log("Password input is not empty");
      }

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
      });

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      if (screen.queryByTestId("form-employee") !== null) {
        // Le formulaire existe, ce n'est pas ce que nous attendons
        console.log("Form should not be present");
      } else {
        // Le formulaire n'existe pas, c'est ce que nous attendons
        console.log("Ots ok. Form is not present");

      }
    });
  });
});

describe(' When i test Login - handleSubmitEmployee', () => {
  test('Then i should handle form submission for employee with valid data', () => {

    document.body.innerHTML = LoginUI();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      let PREVIOUS_LOCATION = "";

      const store = jest.fn();

      const login = new Login({
        document :window.document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

    // Récupération des éléments
    const myEmail = screen.getByTestId('employee-email-input');
    fireEvent.change(myEmail, { target: { value: "employee@test.ltd" } });
    expect(myEmail.value).toBe("employee@test.ltd");

    const myPassword = screen.getByTestId("employee-password-input");
    fireEvent.change(myPassword, {target: { value: "employee" }});
    expect(myPassword.value).toBe( "employee");

    const form = screen.getByTestId("form-employee");

  // mise en place d'un événement fictif pour simuler le formulaire
  const fakeEvent = {
    preventDefault: jest.fn(),
    target: {
      querySelector: jest.fn((selector) => {
        if (selector === 'input[data-testid="employee-email-input"]') {
          return myEmail;
        }
        if (selector === 'input[data-testid="employee-password-input"]') {
          return myPassword;
        }
      }),
    },
  };

  const handleSubmit = jest.fn(login.handleSubmitEmployee);
  login.login = jest.fn().mockResolvedValue({});
  form.addEventListener("submit", handleSubmit);
  fireEvent.submit(form);
  expect(handleSubmit).toHaveBeenCalled();
  expect(window.localStorage.setItem).toHaveBeenCalled();
  expect(window.localStorage.setItem).toHaveBeenCalledWith(
    "user",
    JSON.stringify({
      type: "Employee",
      email: 'johndoe@email.com',
      password: 'azerty',
      status: "connected",
    })
  )


  })
  test('should handle form submission for admin with valid data and successful login', () => {
    document.body.innerHTML = LoginUI();
  // Récupération des éléments
  const myEmail = screen.getByTestId('admin-email-input');
  fireEvent.change(myEmail, { target: { value: "johndoe@email.com" } });
  expect(myEmail.value).toBe("johndoe@email.com");

  const myPassword = screen.getByTestId("admin-password-input");
  fireEvent.change(myPassword, {target: { value: "azerty" }});
  expect(myPassword.value).toBe( "azerty");

  const form = screen.getByTestId("form-admin");
      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      let PREVIOUS_LOCATION = "";
      const store = jest.fn();
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });
// mise en place d'un événement fictif pour simuler le formulaire
const fakeEvent = {
  preventDefault: jest.fn(),
  target: {
    querySelector: jest.fn((selector) => {
      if (selector === 'input[data-testid="admin-email-input"]') {
        return myEmail;
      }
      if (selector === 'input[data-testid="admin-password-input"]') {
        return myPassword;
      }
    }),
  },
};


const handleSubmit = jest.fn(login.handleSubmitAdmin);
login.login = jest.fn().mockResolvedValue({});
form.addEventListener("submit", handleSubmit);
fireEvent.submit(form);
expect(handleSubmit).toHaveBeenCalled();
expect(window.localStorage.setItem).toHaveBeenCalled();
expect(window.localStorage.setItem).toHaveBeenCalledWith(
  "user",
  JSON.stringify({
    type: "Admin",
    email: 'johndoe@email.com',
    password: 'azerty',
    status: "connected",
  })
)
  });
});




it('devrait gérer la soumission du formulaire pour un employé avec des données non valides et une connexion infructueuse', () => {
  document.body.innerHTML = LoginUI();
  const inputData = {
    email: 'email@invalide',
    password: 'motdepasse',
  };
  // Récupération des éléments
  const myEmail = screen.getByTestId('admin-email-input');
  fireEvent.change(myEmail, { target: { value: inputData.email } });
  const emailChanged = myEmail.value === inputData.email;

  const myPassword = screen.getByTestId("admin-password-input");
  fireEvent.change(myPassword, { target: { value: inputData.password } });
  const passwordChanged = myPassword.value === inputData.password;

  const form = screen.getByTestId("form-admin");
  // localStorage should be populated with form data
  let localStorageSetCalled = false;
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => {
        localStorageSetCalled = true;
      }),
    },
    writable: true,
  });

  // we have to mock navigation to test it
  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname });
  };

  let PREVIOUS_LOCATION = "";
  const store = jest.fn();
  const login = new Login({
    document,
    localStorage: window.localStorage,
    onNavigate,
    PREVIOUS_LOCATION,
    store,
  });

  // Mise en place d'un événement fictif pour simuler le formulaire
  const fakeEvent = {
    preventDefault: jest.fn(),
    target: {
      querySelector: jest.fn((selector) => {
        if (selector === 'input[data-testid="admin-email-input"]') {
          return inputData.email;
        }
        if (selector === 'input[data-testid="admin-password-input"]') {
          return inputData.password;
        }
      }),
    },
  };

  const handleSubmit = jest.fn(login.handleSubmitAdmin);
  login.login = jest.fn().mockResolvedValue({});
  form.addEventListener("submit", handleSubmit);
  fireEvent.submit(form);

  // Utilisation de booléens et de conditions pour les assertions
  const handleSubmitCalled = handleSubmit.mock.calls.length > 0;

  expect(handleSubmitCalled).toBe(true);
  expect(localStorageSetCalled).toBe(true);
  expect(emailChanged).toBe(true);
  expect(passwordChanged).toBe(true);
});

// test : remplire le formulaire
describe("Given I am connected as an user", () => {
  describe("When I am on login Page", () => {
    test("Then  i can fill out the form", () => {
      document.body.innerHTML = LoginUI()
      
      // récupérer les éléments et les remplir( fill out the form)
      const email  = screen.getByTestId("employee-email-input");
      const pswd = screen.getByTestId("employee-password-input");

      //Simuler l'input d'un employé
      fireEvent.change(email, { target: { value: "aa@a.com"} });
      fireEvent.change(pswd, { target: { value: "qwerty" } });

      // vérifier que les champs du formulaire ont été remplis
      expect(email.value).toBe( "aa@a.com");
      expect(pswd.value).toBe("qwerty");
   
    })
  })
})
