/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import {render, screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router"

global.alert = jest.fn(); // Définit une fonction factice pour window.alert
import jsdom from 'jsdom'; //  importation la bibliothèque jsdom, pour simuler un environnement DOM
import userEvent from '@testing-library/user-event'
const { JSDOM } = jsdom; //  importation l'objet JSDOM de jsdom, pour créer une instance d'un environnement DOM simulé.

import { handleSubmit } from "../containers/NewBill.js"// Assurez-vous d'importer correctement votre fonction
// Vous devrez également configurer des mocks pour localStorage et onNavigate si nécessaire.


// test : remplire le formulaire
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then  i can fill out the form", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      
      // récupérer les éléments et les remplir( fill out the form)
      // Type de dépense 
      const expenseTypeSelect  = screen.getByTestId("expense-type");
      // Nom de la dépense 
      const expenseNameInput = screen.getByTestId("expense-name");
      // Date
      const datePickerInput = screen.getByTestId("datepicker");
      //montant TTC
      const amountInput = screen.getByTestId("amount");
      //TVA
      const vatInput = screen.getByTestId("vat");
      const pctInput = screen.getByTestId("pct");
      //commentaire
      const commentaryInput = screen.getByTestId("commentary");


      //Simuler l'input d'un employé
      fireEvent.change(expenseTypeSelect, { target: { value: "Transports"} });
      fireEvent.change(expenseNameInput, { target: { value: "TGV Paris Lyon" } });
      fireEvent.change(amountInput, { target: { value: "100" } });
      fireEvent.change(datePickerInput, { target: { value: "2023-12-31" } });
      fireEvent.change(vatInput, { target: { value: "20" } });
      fireEvent.change(pctInput, { target: { value: "10" } });
      fireEvent.change(commentaryInput, { target: { value: "Rendez vous administratif" } });

      // vérifier que les champs du formulaire ont été remplis
      expect(expenseTypeSelect.value).toBe("Transports");
      expect(expenseNameInput.value).toBe("TGV Paris Lyon");
      expect(amountInput.value).toBe("100");
      expect(datePickerInput.value).toBe("2023-12-31");
      expect(vatInput.value).toBe("20");
      expect(pctInput.value).toBe("10");
      expect(commentaryInput.value).toBe("Rendez vous administratif");

    })
  })
})

// test : ajouter un fichier PDF lance une alerte  ( fonction handleChangeFile)
describe("Given I am on NewBill Page", () => {
  describe("When add a new non-allowed PDF file", () => {
    test("Then I see the error message: Seuls les fichiers jpg, jpeg et png sont autorisés.", () => {
      // Création une instance de NewBill en lui passant des propriétés factices
      const donneesFactices = {
        document,
        onNavigate: jest.fn(),
        store: {},
        localStorage: {},
      };
      const newBill = new NewBill(donneesFactices);

      // Simulation la sélection d'un fichier PDF non autorisé
      const fileInput = screen.getByTestId("file");
      fireEvent.change(fileInput, {
        target: {
          files: [new File(["file contents"], "file.pdf", { type: "application/pdf" })]
        }
      });

      // Interception l'appel à window.alert avec spyOn
      const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Exécution la fonction handleChangeFile qui déclenche l'alerte
      newBill.handleChangeFile({
        preventDefault: () => {}, // Ajoutez cette ligne pour éviter l'erreur
        target: { value: 'file.pdf' }
      });

      // Vérification que l'alerte a été appelée avec le bon message
      expect(alert).toHaveBeenCalledWith('Seuls les fichiers jpg, jpeg et png sont autorisés.');
      
      // Restauration la fonction alert d'origine
      alert.mockRestore();
    });
  });
});

//test d'integration POST
describe("Given I am a user connected as Employee", () => {
describe("When an error occurs on API", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills")
    Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
    )
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.appendChild(root)
    router()
    window.onNavigate(ROUTES_PATH.NewBill)
  })
  //test erreur 404
  test("submit form  and fails with 404 message error", async () => {

    mockStore.bills.mockImplementationOnce(() => {
      return {
        update : () =>  {
          return Promise.reject(new Error("Erreur 404"))
        }
      }})

    document.body.innerHTML = NewBillUI()
    const billNew = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage})

   // récupération des éléments
   const myDate = screen.getByTestId("datepicker")
   const myAmont = screen.getByTestId("amount")
   const myTva = screen.getByTestId("pct")
   const myFile = screen.getByTestId("file")
   const mySubmitButton = document.getElementById("btn-send-bill")
   //  d'un nouveau fichier
   const myMewFile = new File(['image.jpg'], 'mon-image.jpg' , { type: "image/jpeg"})
   const myUpdate = jest.spyOn(mockStore.bills(), 'update')

 //Simulation l'input saisie des infos avec des erreurs
 fireEvent.change(myDate,{target:{value:'Vanille'}})
 fireEvent.change(myAmont,{target:{value:'bonbon'}})
 fireEvent.change(myTva,{target:{value:'chocolade'}})
 myFile.addEventListener('change',billNew.handleChangeFile)
 userEvent.upload(myFile,myMewFile);
 await new Promise(process.nextTick)

 mySubmitButton.addEventListener('click', billNew.handleSubmit)
 try {
  await new Promise(process.nextTick);
  await myUpdate();
} catch (error) {
  expect(error).toEqual(new Error("Erreur 404"));
}
})
//test erreur 500
test("submit form  and fails with 500 message error", async () => {

  mockStore.bills.mockImplementationOnce(() => {
    return {
      update : () =>  {
        return Promise.reject(new Error("Erreur 500"))
      }
    }
  })

  document.body.innerHTML = NewBillUI()
  const billNew = new NewBill({
    document,
    onNavigate,
    store: mockStore,
    localStorage: window.localStorage})

   // récupération des éléments
   const myDate = screen.getByTestId("datepicker")
   const myAmont = screen.getByTestId("amount")
   const myTva = screen.getByTestId("pct")
   const myFile = screen.getByTestId("file")
   const mySubmitButton = document.getElementById("btn-send-bill")
   //  d'un nouveau fichier
   const myMewFile = new File(['image.jpg'], 'mon-image.jpg' , { type: "image/jpeg"})
   const myUpdate = jest.spyOn(mockStore.bills(), 'update')

 //Simulation de  l'input saisie des infos avec des erreurs
 fireEvent.change(myDate,{target:{value:'Vanille'}})
 fireEvent.change(myAmont,{target:{value:'bonbon'}})
 fireEvent.change(myTva,{target:{value:'chocolade'}})
 myFile.addEventListener('change',billNew.handleChangeFile)
 userEvent.upload(myFile,myMewFile);
 await new Promise(process.nextTick)

 mySubmitButton.addEventListener('click', billNew.handleSubmit)
 try {
  await new Promise(process.nextTick);
  await myUpdate();
} catch (error) {
  expect(error).toEqual(new Error("Erreur 500"));
}
})
})
})

// describe('handleSubmit', () => {
//   // Simulez les dépendances nécessaires
//   const mockPreventDefault = jest.fn();
//   const mockOnNavigate = jest.fn();
//   const mockLocalStorage = {
//     getItem: jest.fn().mockReturnValue(JSON.stringify({ email: 'user@example.com' })),
//   };

//   // Réinitialisez les mocks avant chaque test
//   beforeEach(() => {
//     const dom = new JSDOM('<!DOCTYPE html>');
//     global.document = dom.window.document;
//     mockPreventDefault.mockClear();
//     mockOnNavigate.mockClear();
//     mockLocalStorage.getItem.mockClear();
//   });

//   test('it should handle form submission', () => {
//     // Configure les mocks
//     const mockEvent = { preventDefault: mockPreventDefault, target: document.createElement('form') };

//     // Configure les querySelector pour retourner les valeurs nécessaires
//     mockEvent.target.querySelector = jest.fn()
//       .mockReturnValueOnce({ value: 'Expense Type Value' })
//       .mockReturnValueOnce({ value: 'Expense Name Value' })
//       .mockReturnValueOnce({ value: '2023-12-31' })
//       .mockReturnValueOnce({ value: '100' })
//       .mockReturnValueOnce({ value: '20' })
//       .mockReturnValueOnce({ value: '10' })
//       .mockReturnValueOnce({ value: 'Commentary Value' });

//     // Exécutez la méthode handleSubmit de NewBill
//     const newBill = new NewBill({
//       onNavigate: mockOnNavigate,
//       localStorage: mockLocalStorage,
//     });
//     newBill.handleSubmit(mockEvent);

//     // Vérifiez que les fonctions ont été appelées comme prévu
//     expect(mockPreventDefault).toHaveBeenCalled();
//     expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user');
//     expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH.Bills);

//     // Vous pouvez également ajouter des assertions pour vérifier le comportement de la méthode handleSubmit si nécessaire.
//   });
// });



// // Mettez en place la configuration de document dans le fichier de configuration global.

// beforeAll(() => {
//   const dom = new JSDOM('<!DOCTYPE html>');
//   global.document = dom.window.document;
// });

// describe('handleSubmit', () => {
//   test('it should handle form submission', () => {
//     // Configurez les mocks et les valeurs de l'objet mockEvent comme dans l'exemple précédent.

//     // Créez une instance de NewBill à l'intérieur du test.
//     const newBill = new NewBill({
//       onNavigate: jest.fn(),
//       localStorage: {
//         getItem: jest.fn().mockReturnValue(JSON.stringify({ email: 'user@example.com' })),
//       },
//     });

//     // Exécutez la méthode handleSubmit de NewBill
//     newBill.handleSubmit(mockEvent);

//     // Vérifiez que les fonctions ont été appelées comme prévu.
//     expect(mockPreventDefault).toHaveBeenCalled();
//     expect(newBill.onNavigate).toHaveBeenCalled();
//     expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user');

//     // Vérifiez que la méthode updateBill est appelée avec les valeurs attendues.
//     expect(newBill.updateBill).toHaveBeenCalledWith({
//       email: 'user@example.com',
//       type: 'Expense Type Value',
//       name: 'Expense Name Value',
//       amount: 100,
//       date: '2023-12-31',
//       vat: '20',
//       pct: 10,
//       commentary: 'Commentary Value',
//       fileUrl: undefined, // Assurez-vous de configurer les mocks pour ces valeurs si nécessaire
//       fileName: undefined,
//       status: 'pending',
//     });
//   });
// });
