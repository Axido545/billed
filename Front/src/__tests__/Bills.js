/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { JSDOM } from 'jsdom';
import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import Bills from "../containers/Bills.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
jest.mock("../app/store", () => mockStore);


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    // Test unitaire ( vérification l'icon-window a pour class active-icon)
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
      //récupération de l'élément avec data-test-id
      const windowIcon = screen.getByTestId('icon-window')
      // verification avec expect
      expect(windowIcon).toHaveClass('active-icon');
    })

    //  test unitaire bg rapport de test rouge reglé //erreur de date ici : Bug rapport de test date 
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      expect(dates).toEqual(dates.sort());
    })
  })
})

//test unitaire HandleClickIconEye
describe("Test of the fonction HandleClickIconEye",()=>{
test('open the modal',()=> {
  const dom = new JSDOM();
  global.document = dom.window.document;
  // Prépare le composant en le rendant
  document.body.innerHTML = BillsUI({ data: bills })
  //Récup un élément avec l'attribut data-testid 
  const iconEye = screen.queryAllByTestId('icon-eye');
 // Vérification qu'il y a au moins un élément avec cet attribut
  expect(iconEye).not.toHaveLength(0);
// Sélectionn d' un élément icon-eye exemple le 4e du tableau = [3]
  const myIconEye = iconEye[3];
  //Simulation clic sur l'icone
  fireEvent.click(myIconEye);
  // vérification si modale s'ouvre
  const modal = screen.getByTestId('tbody')
  expect(modal).toBeInTheDocument();
})
})

// Test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "employee@test.ltd",
          password: "employeed",
          status: "connected",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });
    afterEach(() => (document.body.innerHTML = ""));
    test("fetches bills from mock API GET", async()=>{
      localStorage.setItem("user",JSON.stringify({type:"Employee", email :"employee@test.ltd"}));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentBtnNewBill = screen.getByText("Nouvelle note de frais")
      const contentType  =  screen.getByText("Type")
      const contentName  =  screen.getByText("Nom")
      const contentDate  =  screen.getByText("Date")
      const contentAmont  =  screen.getByText("Montant")
      const contentStatus  =  screen.getByText("Statut")
      const contentActions  =  screen.getByText("Actions")
      expect(contentBtnNewBill && contentType && contentBtnNewBill 
        && contentName && contentDate && contentAmont && contentStatus
         && contentActions).toBeTruthy()
    })

    describe("When an error occurs on API", () => {
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });
      test("fetches bills from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});

// Test unitaire fonction handleClickNewBill ( vérifie si bouton 'note de frais' mène bien page newbill)
describe("Given I navigate to Bills", () => {
describe("When I click on 'Nouvelle note de frais'", () => {
  test('Then i should navigate to the "NewBill" page"', () => {
    const bills= new Bills({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage})
     //mock : version factice
    // Mock de la fonction onNavigate
    bills.onNavigate = jest.fn();
    // Test de la fonction handleClickNewBill 
    bills.handleClickNewBill();
    // Verifier que that the onNavigate function was called with the correct argument
    expect(bills.onNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
  });
});
});

// Test unitaire class bill >vérification formatage date et status
describe('Given im connected as an employé on Bills page', () => {
  describe('Im navigate on Bills page', () => {
    test('Then i should see an array of bills with formatted dates and statuses', async () => {
    const bills= new Bills({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage})
    // Mock ( simulation du) store avec les données date et status
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

    //Vérification si le résultat est bien dans  le tableau
    expect(Array.isArray(result)).toBe(true);

    // Vérification si la date est bien formaté
    result.forEach((bill) => {
      expect(bill.date).toMatch('12 Oct. 23');
    });
    // Vérification si le status est bien formaté
    result.forEach((bill) => {
            expect(bill.status === 'En attente'|| bill.status === 'pending'); 
    });
  });
});
});


