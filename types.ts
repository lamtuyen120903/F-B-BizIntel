
export enum UnitType {
  LIQUID = 'ml',
  SOLID = 'g',
  UNIT = 'pcs'
}

// Added missing CapexData interface
export interface CapexData {
  totalInvestment: number;
  recoveryYears: number;
  yearlyMaintenance: number;
}

// Added missing OpexData interface
export interface OpexData {
  rent: number;
  utilities: number;
  marketing: number;
  others: { name: string; amount: number }[];
}

// Added missing Role interface
export interface Role {
  id: string;
  name: string;
  type: 'hourly' | 'fixed';
  count: number;
  hourlyRate?: number;
  totalHours?: number;
  fixedSalary?: number;
}

// Added missing Ingredient interface
export interface Ingredient {
  id: string;
  name: string;
  type: UnitType;
  unitIn: string;
  unitPrice: number;
  conversionRate: number;
  costPerBaseUnit: number;
  packQuantity?: number;
  unitSize?: number;
}

// Added missing RecipeComponent interface
export interface RecipeComponent {
  ingredientId: string;
  quantity: number;
}

// Added missing MenuItem interface
export interface MenuItem {
  id: string;
  name: string;
  sellingPrice: number;
  sellingPriceApp: number;
  components: RecipeComponent[];
  wastagePercent: number;
  totalCost: number;
}

// Added missing SalesData interface
export interface SalesData {
  inStore: { [key: string]: number };
  delivery: { [key: string]: number };
}

export interface AppState {
  step: number; // 0: Manifesto, 1: Costs, 2: Revenue, 3: Results/Vote, 4: Waitlist, 5: Success
  lite: {
    investment: number;
    recoveryYears: number;
    rent: number;
    payroll: number;
    otherOps: number;
    revenueInputMode: 'month' | 'day'; // Mặc định là 'month'
    storeRevenue: number;
    appRevenue: number;
    appCommissionRate: number;
    cogsRate: number;
  };
  waitlist: {
    name: string;
    shopName: string;
    phone: string;
    favoriteFeature: string;
  };
  // Added properties used by Dashboard and Full version steps
  simulationMode: 'day' | 'month';
  sales: SalesData;
  menu: MenuItem[];
  discounts: { shop: number; app: number };
  capex: CapexData;
  opex: OpexData;
  roles: Role[];
  ingredients: Ingredient[];
}
