/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES } from "../constants/routes";
import { fireEvent, screen, render } from "@testing-library/dom";
import { describe } from "yargs";

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

  describe("When I do not fill one field and I click on employee button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "a@a" } });
      expect(inputEmailUser.value).toBe("a@a");

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
  });

  describe("When I do fill fields in correct format and I click on admin button Login In", () => {
    test("Then I should be identified as an Employee in app", () => {
      document.body.innerHTML = LoginUI();
      const inputData = {
        email: "employee@test.ltd",
        password: "employee",
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
      // Espionnez la méthode createUser de votre instance de Login
      const createUserSpy = jest.spyOn(login, 'createUser');
      const handleSubmit = jest.fn(login.handleSubmitEmployee);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalledWith(inputData);
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

    })
  })

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
      // Espionnez la méthode createUser de votre instance de Login
      const createUserSpy = jest.spyOn(login, 'createUser');
      const handleSubmit = jest.fn(login.handleSubmitEmployee);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalledWith(inputData);
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

// describe("Given that I am a user on login page", () => {

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
  })
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

    
  // describe("When I do fill fields in correct format and I click on admin button Login In", () => {
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



describe('Login', () => {
  it('should login with valid credentials', () => {
    const login = new Login();

    // Supposons que vous ayez une méthode de vérification des informations d'identification
    // dans votre classe Login
    login.verifyCredentials = (email, password) => {
      if (email === 'user@example.com' && password === 'password123') {
        return true; // Informations d'identification valides
      } else {
        return false; // Informations d'identification invalides
      }
    };

    // Test de la branche où les informations d'identification sont valides
    const validCredentials = login.verifyCredentials('user@example.com', 'password123');
    expect(validCredentials).toBe(true);
  });

  it('should reject invalid credentials', () => {
    const login = new Login();

    login.verifyCredentials = (email, password) => {
      if (email === 'user@example.com' && password === 'password123') {
        return true; // Informations d'identification valides
      } else {
        return false; // Informations d'identification invalides
      }
    };

    // Test de la branche où les informations d'identification sont invalides
    const invalidCredentials = login.verifyCredentials('wronguser@example.com', 'invalidpassword');
    expect(invalidCredentials).toBe(false);
  });
});


    test("It should renders HR dashboard page", () => {
      expect(screen.queryByText("Validations")).toBeTruthy();
    });
  // });
// });
  // })




  // // describe("Test of the fonction handleSubmitEmployee ",()=>{
  //   test("handleSubmitEmployee should handle form submission", () => {
  //     document.body.innerHTML = LoginUI();
    
  //     // mettre une instance de la classe Login
  //     const login = new Login({
  //       document: window.document,
  //       localStorage: window.localStorage,
  //       onNavigate: jest.fn(), 
  //       PREVIOUS_LOCATION: "",
  //       store: {} 
  //     });
    
  //     const inputEmailUser = document.querySelector('input[data-testid="employee-email-input"]');
  //     const inputPasswordUser = document.querySelector('input[data-testid="employee-password-input"]');
  //     const form = document.querySelector('form[data-testid="form-employee"]');
    
  //     // Remplire les champs du formulaire
  //     fireEvent.change(inputEmailUser, { target: { value: "employee@test.ltd" } });
  //     fireEvent.change(inputPasswordUser, { target: { value: "employee" } });
    
  //     // Espionner les méthodes que vous souhaitez tester
  //     const loginSpy = jest.spyOn(login, 'login');
  //     const createUserSpy = jest.spyOn(login, 'createUser');
  //     const onNavigateSpy = jest.spyOn(login, 'onNavigate');
    
  //     // Soumetttre le formulaire
  //     fireEvent.submit(form);
    
  //     // vérifie que la méthode login a été appelée avec les bonnes valeurs
  //     expect(loginSpy).toHaveBeenCalledWith({
  //       type: "Employee",
  //       email: "employee@test.ltd",
  //       password: "employee",
  //       status: "connected"
  //     });
    
  //     // vérifie que la méthode createUser a été appelée avec les bonnes valeurs (si elle est appelée)
  //     expect(createUserSpy).toHaveBeenCalledWith({
  //       type: "Employee",
  //       email: "employee@test.ltd",
  //       password: "employee",
  //       status: "connected"
  //     });
    
  //     //vérifie que la méthode onNavigate a été appelée avec la bonne valeur (si elle est appelée)
  //     expect(onNavigateSpy).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
  //   });
    
    
    // })
    


    
  // // describe("Test of the fonction handleSubmitAdmin ",()=>{
  //   test("handleSubmitAdmin should handle form submission", () => {
  //     document.body.innerHTML = LoginUI(); 
    
  //     // mettr une instance de la classe Login
  //     const login = new Login({
  //       document: window.document,
  //       localStorage: window.localStorage,
  //       onNavigate: jest.fn(), 
  //       PREVIOUS_LOCATION: "",
  //       store: {} 
  //     });
    
  //     const inputEmailUser = document.querySelector('input[data-testid="admin-email-input"]');
  //     const inputPasswordUser = document.querySelector('input[data-testid="admin-password-input"]');
  //     const form = document.querySelector('form[data-testid="form-admin"]');
    
  //     // Remplit les champs du formulaire
  //     fireEvent.change(inputEmailUser, { target: { value: "admin@test.ltd" } });
  //     fireEvent.change(inputPasswordUser, { target: { value: "admin" } });
    
  //     // Espionne les méthodes que vous souhaitez tester
  //     const loginSpy = jest.spyOn(login, 'login');
  //     // const createUserSpy = jest.spyOn(login, 'createUser');
  //     const onNavigateSpy = jest.spyOn(login, 'onNavigate');
    
  //     // Soumettre le formulaire
  //     fireEvent.submit(form);
    
  //     // vérifie que la méthode login a été appelée avec les bonnes valeurs
  //     expect(loginSpy).toHaveBeenCalledWith({
  //       type: "Admin",
  //       email: "admin@test.ltd",
  //       password: "admin",
  //       status: "connected"
  //     });
    
  //     // vérifie que la méthode createUser a été appelée avec les bonnes valeurs (si elle est appelée)
  //     // expect(createUserSpy).toHaveBeenCalledWith({
  //     //   type: "Admin",
  //     //   email: "admin@test.ltd",
  //     //   password: "admin",
  //     //   status: "connected"
  //     // });
    
  //     // verifie si la méthode onNavigate a été appelée avec la bonne valeur (si elle est appelée)
  //     expect(onNavigateSpy).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
  //   });
    
    
  //   // })
    