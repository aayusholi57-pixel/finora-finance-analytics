import { useMemo, useState } from 'react';
import {
  ArrowDownLeft, ArrowUpRight, Bell, CalendarDays, ChevronDown, CircleHelp,
  CreditCard, Download, LayoutDashboard, LogOut, Menu, MoreHorizontal,
  Plus, Search, Settings, ShieldCheck, Sparkles, Target, TrendingUp,
  Wallet, X, ArrowUpRightFromSquare,
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

type Transaction = {
  id: number; name: string; category: string; date: string; amount: number;
  kind: 'income' | 'expense'; initials: string; color: string;
};

const initialTransactions: Transaction[] = [
  { id: 1, name: 'Whole Foods Market', category: 'Groceries', date: 'Today, 10:42 AM', amount: 84.26, kind: 'expense', initials: 'WF', color: 'mint' },
  { id: 2, name: 'Salary payment', category: 'Income', date: 'Today, 9:00 AM', amount: 2450, kind: 'income', initials: 'SP', color: 'lavender' },
  { id: 3, name: 'Blue Bottle Coffee', category: 'Food & drink', date: 'Yesterday', amount: 12.5, kind: 'expense', initials: 'BB', color: 'peach' },
  { id: 4, name: 'Uber trip', category: 'Transport', date: 'Yesterday', amount: 24.8, kind: 'expense', initials: 'UB', color: 'sky' },
  { id: 5, name: 'Netflix subscription', category: 'Subscriptions', date: 'Oct 7, 2026', amount: 15.99, kind: 'expense', initials: 'N', color: 'rose' },
];

const cashflow = [
  { day: '01', income: 230, expenses: 160 }, { day: '03', income: 340, expenses: 210 },
  { day: '05', income: 260, expenses: 185 }, { day: '07', income: 420, expenses: 250 },
  { day: '09', income: 310, expenses: 205 }, { day: '11', income: 490, expenses: 290 },
  { day: '13', income: 370, expenses: 220 }, { day: '15', income: 530, expenses: 310 },
  { day: '17', income: 390, expenses: 245 }, { day: '19', income: 470, expenses: 280 },
  { day: '21', income: 350, expenses: 215 }, { day: '23', income: 560, expenses: 320 },
  { day: '25', income: 440, expenses: 265 }, { day: '27', income: 610, expenses: 355 },
  { day: '29', income: 480, expenses: 295 }, { day: '31', income: 680, expenses: 330 },
];

const budgets = [
  { name: 'Housing', spent: 1250, limit: 1600, color: '#a5c8ad', icon: '⌂' },
  { name: 'Food & dining', spent: 428, limit: 600, color: '#c8b7f2', icon: '✳' },
  { name: 'Transport', spent: 186, limit: 300, color: '#f2c7a5', icon: '↗' },
  { name: 'Subscriptions', spent: 64, limit: 100, color: '#a9c8e8', icon: '◉' },
];

const money = (amount: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 2,
}).format(amount);

function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [query, setQuery] = useState('');
  const [activeNav, setActiveNav] = useState('Overview');
  const [showAdd, setShowAdd] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food & dining');
  const [newKind, setNewKind] = useState<'expense' | 'income'>('expense');

  const filtered = useMemo(() => transactions.filter((item) =>
    `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  ), [transactions, query]);

  const addTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(newAmount);
    if (!newName.trim() || !Number.isFinite(amount) || amount <= 0) return;
    setTransactions((items) => [{
      id: Date.now(), name: newName.trim(), category: newKind === 'income' ? 'Income' : newCategory,
      date: 'Just now', amount, kind: newKind, initials: newName.trim().slice(0, 2).toUpperCase(),
      color: 'mint',
    }, ...items]);
    setNewName(''); setNewAmount(''); setShowAdd(false);
  };

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Transactions', icon: CreditCard },
    { label: 'Budgets', icon: Target },
    { label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="app-shell">
      {mobileMenu && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#" aria-label="Finora home">
          <span className="brand-mark"><Wallet size={21} strokeWidth={2.2} /></span>
          <span>finora<span className="brand-period">.</span></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switch"><span className="workspace-avatar">A</span><span className="workspace-copy"><b>Personal account</b><small>Free plan</small></span><ChevronDown size={15} /></button>
        <div className="nav-label">MENU</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activeNav === label ? 'nav-active' : ''}`} onClick={() => { setActiveNav(label); setMobileMenu(false); }}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {label === 'Transactions' && <span className="nav-count">{transactions.length}</span>}
            </button>
          ))}
        </nav>
        <div className="nav-label tools-label">PREFERENCES</div>
        <nav className="main-nav" aria-label="Preferences">
          <button className="nav-item" onClick={() => setActiveNav('Settings')}><Settings size={18} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => setActiveNav('Help center')}><CircleHelp size={18} /><span>Help center</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><span className="upgrade-icon"><Sparkles size={17} /></span><b>Make money clearer.</b><p>Get more insights into your spending habits.</p><button onClick={() => setActiveNav('Plans')}>Explore Finora Plus <ArrowUpRightFromSquare size={13} /></button></div>
          <button className="profile-button"><span className="profile-avatar">AO</span><span className="profile-copy"><b>Aayush Oli</b><small>Personal workspace</small></span><MoreHorizontal size={18} /></button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu-button icon-button" onClick={() => setMobileMenu(true)} aria-label="Open navigation"><Menu size={20} /></button><span className="breadcrumb">Workspace</span><span className="breadcrumb-slash">/</span><b>{activeNav}</b></div>
          <div className="topbar-actions"><div className="secure-label"><ShieldCheck size={14} /> Your finances, organized</div><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><button className="top-avatar" aria-label="Account menu">AO</button></div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot" /> YOUR FINANCIAL SNAPSHOT</div><h1>Good afternoon, Aayush <span className="wave">✳</span></h1><p>Here’s what’s happening with your money. <span className="demo-note">Demo data</span></p></div>
            <div className="heading-actions"><button className="button button-secondary" onClick={() => window.print()}><Download size={16} /> Export</button><button className="button button-primary" onClick={() => setShowAdd(true)}><Plus size={17} /> Add transaction</button></div>
          </section>

          <section className="stat-grid" aria-label="Financial summary">
            <article className="stat-card balance-card"><div className="stat-top"><span className="stat-label">Total balance</span><span className="stat-icon balance-icon"><Wallet size={17} /></span></div><div className="stat-value">$12,840<span className="decimal">.50</span></div><div className="stat-footer"><span className="trend-positive"><TrendingUp size={14} /> 8.2%</span><span>vs. last month</span><span className="stat-period">Oct 2026 <ChevronDown size={13} /></span></div><div className="balance-sparkline"><svg viewBox="0 0 300 32" preserveAspectRatio="none" role="img" aria-label="Illustrative upward balance trend"><path d="M0 27 C20 22 24 25 39 18 S62 24 79 14 S101 20 119 12 S144 17 158 8 S181 17 202 10 S223 14 239 5 S271 12 300 1" fill="none" stroke="#8ec6a0" strokeWidth="2" /></svg></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Monthly income</span><span className="stat-icon income-icon"><ArrowDownLeft size={17} /></span></div><div className="stat-value">$4,250<span className="decimal">.00</span></div><div className="stat-footer"><span className="trend-positive"><TrendingUp size={14} /> 4.6%</span><span>vs. last month</span></div><div className="mini-bars" aria-hidden="true">{[24,31,26,42,34,48,37,55,44,62,49,69].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Monthly expenses</span><span className="stat-icon expense-icon"><ArrowUpRight size={17} /></span></div><div className="stat-value">$2,184<span className="decimal">.75</span></div><div className="stat-footer"><span className="trend-negative"><ArrowUpRight size={14} /> 2.1%</span><span>vs. last month</span></div><div className="mini-bars expense-bars" aria-hidden="true">{[52,44,58,37,47,32,51,39,59,42,48,35].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Savings rate</span><span className="stat-icon savings-icon"><Target size={17} /></span></div><div className="stat-value">48<span className="decimal">.6%</span></div><div className="stat-footer"><span className="trend-positive"><TrendingUp size={14} /> 3.4%</span><span>vs. last month</span></div><div className="savings-track"><span /></div><div className="savings-caption"><span>Monthly goal</span><b>50%</b></div></article>
          </section>

          <section className="content-grid">
            <article className="panel cashflow-panel">
              <div className="panel-header"><div><h2>Cash flow</h2><p>Track your income and spending over time</p></div><button className="select-button"><CalendarDays size={14} /> This month <ChevronDown size={14} /></button></div>
              <div className="chart-legend"><span><i className="legend-income" /> Income</span><span><i className="legend-expenses" /> Expenses</span><span className="chart-total">Net cash flow <b>+$2,065.25</b></span></div>
              <div className="cashflow-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={cashflow} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8fc5a0" stopOpacity={0.22} /><stop offset="95%" stopColor="#8fc5a0" stopOpacity={0} /></linearGradient><linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8b7f2" stopOpacity={0.2} /><stop offset="95%" stopColor="#c8b7f2" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e9ece7" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#939b92', fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#939b92', fontSize: 11 }} tickFormatter={(v:number)=>`$${v}`} /><Tooltip formatter={(value) => money(Number(value))} contentStyle={{ borderRadius: 12, border: '1px solid #e8ebe5', fontSize: 12 }} /><Area type="monotone" dataKey="income" name="Income" stroke="#6eaa82" strokeWidth={2.3} fill="url(#incomeFill)" /><Area type="monotone" dataKey="expenses" name="Expenses" stroke="#b5a0e9" strokeWidth={2.3} fill="url(#expenseFill)" /></AreaChart></ResponsiveContainer></div>
              <div className="chart-footnote"><span><span className="footnote-dot" /> Income is ahead of expenses this month</span><button onClick={() => setActiveNav('Analytics')}>View full analytics <ArrowUpRight size={14} /></button></div>
            </article>

            <article className="panel budget-panel">
              <div className="panel-header"><div><h2>Monthly budgets</h2><p>Keep your spending on track</p></div><button className="more-button" aria-label="Budget options"><MoreHorizontal size={20} /></button></div>
              <div className="budget-summary"><div><span>Total spent</span><b>$1,928<span>.00</span></b></div><div className="budget-total"><span>Monthly limit</span><b>$2,600</b></div></div>
              <div className="overall-progress"><span /></div>
              <div className="budget-list">{budgets.map((budget)=><div className="budget-row" key={budget.name}><div className="budget-row-top"><span className="budget-category"><i style={{background:budget.color}}>{budget.icon}</i>{budget.name}</span><span className="budget-amount"><b>{money(budget.spent)}</b><span> / {money(budget.limit)}</span></span></div><div className="budget-track"><span style={{width:`${Math.min(100,budget.spent/budget.limit*100)}%`,background:budget.color}} /></div></div>)}</div>
              <button className="text-link" onClick={() => setActiveNav('Budgets')}>Manage budgets <ArrowUpRight size={14} /></button>
            </article>
          </section>

          <section className="panel transactions-panel">
            <div className="panel-header transaction-header"><div><h2>Recent transactions</h2><p>A closer look at where your money moves</p></div><div className="transaction-actions"><label className="search-box"><Search size={15} /><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search transactions..." aria-label="Search transactions" /><kbd>⌘ K</kbd></label><button className="button button-secondary button-small" onClick={() => setActiveNav('Transactions')}>View all <ArrowUpRight size={14} /></button></div></div>
            <div className="transaction-table-wrap"><table className="transaction-table"><thead><tr><th>TRANSACTION</th><th>CATEGORY</th><th>DATE</th><th className="amount-heading">AMOUNT</th><th /></tr></thead><tbody>{filtered.map((item)=><tr key={item.id}><td><div className="transaction-name"><span className={`merchant-icon ${item.color}`}>{item.initials}</span><span><b>{item.name}</b><small>{item.kind === 'income' ? 'Money received' : 'Card payment'}</small></span></div></td><td><span className="category-pill">{item.category}</span></td><td className="date-cell">{item.date}</td><td className={`amount-cell ${item.kind === 'income' ? 'amount-income' : ''}`}>{item.kind === 'income' ? '+' : '−'}{money(item.amount)}</td><td><button className="row-more" aria-label={`More options for ${item.name}`} onClick={() => setTransactions((items)=>items.filter((t)=>t.id!==item.id))} title="Remove demo transaction"><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table>{filtered.length===0 && <div className="empty-state">No transactions match “{query}”. Try another search.</div>}</div>
            <div className="table-footer"><span>Showing <b>{filtered.length}</b> of <b>{transactions.length}</b> demo transactions</span><button onClick={() => setTransactions(initialTransactions)}>Reset demo data <ArrowUpRight size={13} /></button></div>
          </section>
          <footer className="page-footer"><span>© 2026 Finora Finance</span><span><i /> All figures shown are illustrative demo data</span><a href="#security"><ShieldCheck size={13} /> Privacy-first by design</a></footer>
        </div>
      </main>

      {showAdd && <div className="modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)setShowAdd(false);}}><section className="transaction-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="modal-eyebrow">YOUR MONEY, YOUR WAY</span><h2 id="modal-title">Add transaction</h2></div><button className="icon-button" onClick={()=>setShowAdd(false)} aria-label="Close dialog"><X size={19}/></button></div><form onSubmit={addTransaction}><label className="form-label">Transaction name<input required maxLength={80} value={newName} onChange={(e)=>setNewName(e.target.value)} placeholder="e.g. Grocery shopping"/></label><label className="form-label">Amount (USD)<input required min="0.01" step="0.01" type="number" value={newAmount} onChange={(e)=>setNewAmount(e.target.value)} placeholder="0.00"/></label><label className="form-label">Type<select value={newKind} onChange={(e)=>setNewKind(e.target.value as 'expense'|'income')}><option value="expense">Expense</option><option value="income">Income</option></select></label>{newKind==='expense'&&<label className="form-label">Category<select value={newCategory} onChange={(e)=>setNewCategory(e.target.value)}><option>Food & dining</option><option>Groceries</option><option>Transport</option><option>Housing</option><option>Subscriptions</option><option>Shopping</option><option>Health</option><option>Other</option></select></label>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={()=>setShowAdd(false)}>Cancel</button><button type="submit" className="button button-primary"><Plus size={16}/> Save transaction</button></div></form></section></div>}
    </div>
  );
}

export default App;