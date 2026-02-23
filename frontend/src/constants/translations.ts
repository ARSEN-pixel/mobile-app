// Romanian translations with i18n support structure

export const translations = {
  ro: {
    // Navigation
    nav: {
      dashboard: 'Acasă',
      add: 'Adaugă',
      transactions: 'Tranzacții',
      insights: 'Analiză',
      settings: 'Setări',
    },
    
    // Auth
    auth: {
      welcome: 'Bine ai venit',
      welcomeSubtitle: 'Urmărește-ți cheltuielile inteligent',
      continueWith: 'Continuă cu',
      continueAsGuest: 'Continuă ca invitat',
      guestModeInfo: 'Datele vor fi salvate local. Conectează-te pentru sincronizare în cloud.',
      signOut: 'Deconectare',
      deleteAccount: 'Șterge contul',
      or: 'sau',
    },
    
    // Dashboard
    dashboard: {
      greeting: 'Bună',
      totalSpent: 'Total cheltuit',
      thisMonth: 'luna aceasta',
      budget: 'Buget',
      remaining: 'rămas',
      exceeded: 'depășit',
      recentTransactions: 'Tranzacții recente',
      viewAll: 'Vezi toate',
      noTransactions: 'Nicio tranzacție',
      addFirst: 'Adaugă prima ta cheltuială',
      quickAdd: 'Adaugă rapid',
    },
    
    // Add expense
    add: {
      title: 'Adaugă cheltuială',
      editTitle: 'Editează cheltuială',
      amount: 'Sumă',
      category: 'Categorie',
      date: 'Data',
      expenseTitle: 'Titlu',
      titlePlaceholder: 'ex: Prânz la restaurant',
      paymentMethod: 'Metodă de plată',
      notes: 'Note',
      notesPlaceholder: 'Adaugă note opționale...',
      tags: 'Etichete',
      tagsPlaceholder: 'Adaugă etichete separate prin virgulă',
      recurring: 'Cheltuială recurentă',
      addReceipt: 'Adaugă bon',
      save: 'Salvează',
      cancel: 'Anulează',
      delete: 'Șterge',
      confirmDelete: 'Ești sigur că vrei să ștergi această cheltuială?',
    },
    
    // Transactions
    transactions: {
      title: 'Tranzacții',
      search: 'Caută tranzacții...',
      filter: 'Filtrează',
      noResults: 'Nicio tranzacție găsită',
      dateRange: 'Interval de date',
      from: 'De la',
      to: 'Până la',
      minAmount: 'Sumă minimă',
      maxAmount: 'Sumă maximă',
      allCategories: 'Toate categoriile',
      allMethods: 'Toate metodele',
      clearFilters: 'Șterge filtrele',
      applyFilters: 'Aplică',
      bulkActions: 'Acțiuni în masă',
      selectAll: 'Selectează tot',
      deleteSelected: 'Șterge selectate',
      moveCategory: 'Mută în categorie',
      export: 'Exportă',
    },
    
    // Insights
    insights: {
      title: 'Analiză',
      dateRange: 'Perioada',
      totalSpent: 'Total cheltuit',
      monthlyAverage: 'Medie lunară',
      highestMonth: 'Luna cu cele mai mari cheltuieli',
      biggestCategory: 'Cea mai mare categorie',
      weekdayVsWeekend: 'Zile lucrătoare vs Weekend',
      weekday: 'Zile lucrătoare',
      weekend: 'Weekend',
      monthlyTrend: 'Tendință lunară',
      categoryBreakdown: 'Distribuție pe categorii',
      categoryOverTime: 'Categorii în timp',
      expenseTable: 'Tabel cheltuieli',
      categoryTable: 'Tabel categorii',
      share: 'Pondere',
      exportCSV: 'Exportă CSV',
      exportPDF: 'Exportă PDF',
      smartInsights: 'Observații inteligente',
      spentMoreThan: 'Ai cheltuit cu {{percent}}% mai mult decât luna trecută',
      spentLessThan: 'Ai cheltuit cu {{percent}}% mai puțin decât luna trecută',
      topCategories: 'Top 3 categorii s-au schimbat',
    },
    
    // Categories
    categories: {
      title: 'Categorii',
      add: 'Adaugă categorie',
      edit: 'Editează categorie',
      name: 'Nume',
      icon: 'Pictogramă',
      color: 'Culoare',
      favorite: 'Favorit',
      delete: 'Șterge',
      confirmDelete: 'Ești sigur că vrei să ștergi această categorie?',
      hasExpenses: 'Această categorie are cheltuieli asociate. Șterge mai întâi cheltuielile.',
    },
    
    // Budgets
    budgets: {
      title: 'Bugete',
      monthlyBudget: 'Buget lunar',
      setBudget: 'Setează buget',
      categoryBudgets: 'Bugete pe categorii',
      addCategoryBudget: 'Adaugă buget pentru categorie',
      spent: 'Cheltuit',
      of: 'din',
      remaining: 'Rămas',
      exceeded: 'Depășit cu',
      alert70: 'Ai atins 70% din buget',
      alert90: 'Ai atins 90% din buget',
      alert100: 'Ai depășit bugetul!',
      noBudget: 'Niciun buget setat',
      setBudgetInfo: 'Setează un buget pentru a-ți urmări cheltuielile',
    },
    
    // Settings
    settings: {
      title: 'Setări',
      appearance: 'Aspect',
      theme: 'Temă',
      light: 'Luminos',
      dark: 'Întunecat',
      system: 'Sistem',
      currency: 'Monedă',
      language: 'Limbă',
      data: 'Date',
      backup: 'Backup',
      restore: 'Restaurează',
      exportData: 'Exportă datele mele',
      deleteAllData: 'Șterge toate datele',
      confirmDeleteAll: 'Ești sigur? Această acțiune nu poate fi anulată.',
      account: 'Cont',
      connectedAccounts: 'Conturi conectate',
      link: 'Conectează',
      unlink: 'Deconectează',
      privacy: 'Confidențialitate',
      about: 'Despre',
      version: 'Versiune',
      sync: 'Sincronizare',
      lastSync: 'Ultima sincronizare',
      syncNow: 'Sincronizează acum',
      notifications: 'Notificări',
      budgetAlerts: 'Alerte buget',
    },
    
    // Common
    common: {
      save: 'Salvează',
      cancel: 'Anulează',
      delete: 'Șterge',
      edit: 'Editează',
      done: 'Gata',
      loading: 'Se încarcă...',
      error: 'Eroare',
      success: 'Succes',
      retry: 'Reîncearcă',
      yes: 'Da',
      no: 'Nu',
      ok: 'OK',
      today: 'Astăzi',
      yesterday: 'Ieri',
      thisWeek: 'Săptămâna aceasta',
      thisMonth: 'Luna aceasta',
      lastMonth: 'Luna trecută',
      custom: 'Personalizat',
    },
    
    // Months
    months: [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ],
    
    // Short months
    monthsShort: [
      'Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun',
      'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    
    // Days
    days: [
      'Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'
    ],
    
    // Short days
    daysShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  },
  
  en: {
    // English translations for future i18n support
    nav: {
      dashboard: 'Home',
      add: 'Add',
      transactions: 'Transactions',
      insights: 'Insights',
      settings: 'Settings',
    },
    // ... rest would be added for EN support
  },
};

export type Language = 'ro' | 'en';
export const t = translations.ro; // Default to Romanian
