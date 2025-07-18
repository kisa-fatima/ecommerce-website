import React, { useEffect, useState } from 'react';
import DashboardStatsCard from './DashboardStatsCard';
import { FaChartBar, FaShoppingCart, FaUsers, FaBoxOpen, FaExclamationCircle, FaClipboardList, FaCheckCircle, FaEye } from 'react-icons/fa';
import { getTotalItemsOrdered, getTotalRevenue, getTotalUsers, getTotalOrders, getTotalProducts, getOutOfStockProducts, getPendingOrders, getCategoryPathById, getAllCategoriesFlat } from '../services/databaseFunctions';
import db from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DashboardOverviewCard = () => {
  const [totalItemsOrdered, setTotalItemsOrdered] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  const [outOfStock, setOutOfStock] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(null);
  const [activeProducts, setActiveProducts] = useState(null);
  const [deliveredOrders, setDeliveredOrders] = useState(null);
  const [categoryBarData, setCategoryBarData] = useState([]);
  const [stockPieData, setStockPieData] = useState([]);

  useEffect(() => {
    async function fetchTotals() {
      const [items, revenue, users, orders, products, outStock, pending] = await Promise.all([
        getTotalItemsOrdered(),
        getTotalRevenue(),
        getTotalUsers(),
        getTotalOrders(),
        getTotalProducts(),
        getOutOfStockProducts(),
        getPendingOrders()
      ]);
      setTotalItemsOrdered(items);
      setTotalRevenue(revenue);
      setTotalUsers(users);
      setTotalOrders(orders);
      setTotalProducts(products);
      setOutOfStock(outStock);
      setPendingOrders(pending);

      // Fetch active products
      const productsCol = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCol);
      setActiveProducts(productsSnapshot.docs.filter(doc => doc.data().state === true).length);

      // Fetch delivered orders
      const ordersCol = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCol);
      setDeliveredOrders(ordersSnapshot.docs.filter(doc => doc.data().status === 'delivered').length);

      // Bar chart: count products in each root category using ancestor logic
      const cats = await getAllCategoriesFlat();
      // Build a map: categoryId -> [ancestorIds...]
      const idToAncestors = {};
      const idToName = {};
      cats.forEach(cat => {
        let path = [];
        let current = cat;
        while (current) {
          path.unshift(current.id);
          current = cats.find(c => c.id === current.parentID);
        }
        idToAncestors[cat.id] = path;
        idToName[cat.id] = cat.name;
      });
      // Find the root category IDs for Men, Women, Kids
      const menRoot = cats.find(cat => cat.name.toLowerCase() === 'men' && !cat.parentID);
      const womenRoot = cats.find(cat => cat.name.toLowerCase() === 'women' && !cat.parentID);
      const kidsRoot = cats.find(cat => cat.name.toLowerCase() === 'kids' && !cat.parentID);
      const menRootId = menRoot ? menRoot.id : null;
      const womenRootId = womenRoot ? womenRoot.id : null;
      const kidsRootId = kidsRoot ? kidsRoot.id : null;
      let menCount = 0, womenCount = 0, kidsCount = 0;
      productsSnapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        const catId = data.categoryID || data.category;
        if (!catId) return;
        const ancestors = idToAncestors[catId] || [];
        if (menRootId && ancestors.includes(menRootId)) menCount++;
        if (womenRootId && ancestors.includes(womenRootId)) womenCount++;
        if (kidsRootId && ancestors.includes(kidsRootId)) kidsCount++;
      });
      setCategoryBarData([
        { category: 'Men', count: menCount },
        { category: 'Women', count: womenCount },
        { category: 'Kids', count: kidsCount },
      ]);

      // Pie chart: in stock vs out of stock
      let inStock = 0, outStockPie = 0;
      productsSnapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        if (data.inStock === false) outStockPie++;
        else inStock++;
      });
      setStockPieData([
        { name: 'In Stock', value: inStock },
        { name: 'Out of Stock', value: outStockPie },
      ]);
    }
    fetchTotals();
  }, []);

  const pieColors = ['#111', '#bbb'];

  return (
    <div style={{
      background: '#f6f7fa',
      borderRadius: 22,
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      border: '1px solid #ececec',
      padding: '32px 32px',
      marginBottom: 24,
      marginTop: 8,
      minWidth: 0
    }}>
      <div style={{
        minWidth: 220,
        minHeight: 80,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 24,
        borderRadius: 18
      }}>
        <div style={{ fontSize: 15, color: '#888', marginBottom: 8 }}>Since joined</div>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#222', marginBottom: 8 }}>Performance Overview</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
          width: '100%',
        }}
      >
        <DashboardStatsCard icon={<FaChartBar />} label="Total Revenue" value={totalRevenue === null ? <span style={{ color: '#bbb' }}>—</span> : `$${totalRevenue}`} />
        <DashboardStatsCard icon={<FaShoppingCart />} label="Total Item Orders" value={totalItemsOrdered === null ? <span style={{ color: '#bbb' }}>—</span> : totalItemsOrdered} />
        <DashboardStatsCard icon={<FaUsers />} label="Total Users" value={totalUsers === null ? <span style={{ color: '#bbb' }}>—</span> : totalUsers} />
        <DashboardStatsCard icon={<FaClipboardList />} label="Total Orders" value={totalOrders === null ? <span style={{ color: '#bbb' }}>—</span> : totalOrders} />
        <DashboardStatsCard icon={<FaBoxOpen />} label="Total Products" value={totalProducts === null ? <span style={{ color: '#bbb' }}>—</span> : totalProducts} />
        <DashboardStatsCard icon={<FaExclamationCircle color="#ff3b3b" />} label="Out of Stock" value={outOfStock === null ? <span style={{ color: '#bbb' }}>—</span> : outOfStock} />
        <DashboardStatsCard icon={<FaClipboardList color="#ffb300" />} label="Pending Orders" value={pendingOrders === null ? <span style={{ color: '#bbb' }}>—</span> : pendingOrders} />
        <DashboardStatsCard icon={<FaEye color="#52c41a" />} label="Active Products" value={activeProducts === null ? <span style={{ color: '#bbb' }}>—</span> : activeProducts} />
        <DashboardStatsCard icon={<FaCheckCircle color="#52c41a" />} label="Delivered Orders" value={deliveredOrders === null ? <span style={{ color: '#bbb' }}>—</span> : deliveredOrders} />
      </div>
      {/* Graphs Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 40, justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 1px 8px rgba(0,0,0,0.04)', padding: 24, minWidth: 320, flex: 1, maxWidth: 480 }}>
          <h3 style={{ marginBottom: 16, color: '#222', fontWeight: 600 }}>Products by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryBarData}>
              <XAxis dataKey="category" stroke="#888" />
              <YAxis allowDecimals={false} stroke="#888" />
              <Tooltip />
              <Bar dataKey="count" fill="#111" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 1px 8px rgba(0,0,0,0.04)', padding: 24, minWidth: 320, flex: 1, maxWidth: 480 }}>
          <h3 style={{ marginBottom: 16, color: '#222', fontWeight: 600 }}>Stock Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stockPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {stockPieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCard;
