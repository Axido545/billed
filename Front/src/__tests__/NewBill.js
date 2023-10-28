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





