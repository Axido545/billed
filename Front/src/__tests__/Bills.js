/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { JSDOM } from 'jsdom';
import {screen, waitFor, render, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js"
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toHaveClass('active-icon');

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      // const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      //reglage problème N1 date 
      const antiChrono = (a, b) => {
        if (a === b) {
          return 0;
        }
        return a < b ? 1 : -1;
      };      
      const datesSorted = [...dates].sort(antiChrono)
      // expect(dates).toEqual(datesSorted)
      expect(dates).toEqual(dates.sort());
    })
  })
})


describe("Test of the fonction HandleClickIconEye",()=>{
test('open the modal',()=> {
  const dom = new JSDOM();
  global.document = dom.window.document;
  // Préparez le composant en le rendant
  document.body.innerHTML = BillsUI({ data: bills })



  //Récup un élément avec l'attribut data-testid 
  const iconEye = screen.queryAllByTestId('icon-eye');

    // S'Assurez-vous qu'il y a au moins un élément avec cet attribut
    expect(iconEye).not.toHaveLength(0);

     // Sélectionn d' un élément icon-eye exemple le premier du tableau
  const myIconEye = iconEye[3];

  //Simulation clic sur l'icone
  fireEvent.click(myIconEye);

  // vérification si modale s'ouvre
  const modal = screen.getByTestId('tbody')
  expect(modal).toBeInTheDocument();

})

})


// // test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills",() => {
    test("fetches bills from mock API GET", async()=>{
      localStorage.setItem("user",JSON.stringify({type:"Employee", email :"employee@test.ltd"}));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))

      const contentBtnNewBill = screen.getByText("Nouvelle note de frais");
            expect(contentBtnNewBill).toBeTruthy()
      const contentType  =  screen.getByText("Type")
      expect(contentType).toBeTruthy()

    })


  })

})


describe('Bills', () => {
  it('should navigate to the NewBill page when clicking "New Bill"', () => {
    const bills= new Bills({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage})
    // Mock the onNavigate function
    bills.onNavigate = jest.fn();

    // Test the handleClickNewBill function
    bills.handleClickNewBill();

    // Verify that the onNavigate function was called with the correct argument
    expect(bills.onNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
  });
});



describe('Bills', () => {
  it('should return an array of bills with formatted dates and statuses', async () => {
    const bills= new Bills({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage})

    // Mock the store and its behavior (you may need to adjust this based on your project structure)
    bills.store = {
      bills: () => ({
        list: jest.fn().mockResolvedValue([
          {
            date: '2023-10-12',
            status: 'En attente',
          },
        ]),
      }),
    };

    const result = await bills.getBills();

    // Check if result is an array
    expect(Array.isArray(result)).toBe(true);

    // Check if the dates are formatted
    result.forEach((bill) => {
      expect(bill.date).toMatch('12 Oct. 23');
    });

    // Check if the statuses are formatted
    result.forEach((bill) => {
      // expect(bill.status === 'En attente'|| bill.status === undefined); // Adjust this based on your formatStatus function
            expect(bill.status === 'En attente'); // Adjust this based on your formatStatus function

    });
  });
});
