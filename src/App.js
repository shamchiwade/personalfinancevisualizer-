import { Button, Card, CardContent, Input } from "@mui/material";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PersonalFinanceVisualizer = () => {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [editingIndex, setEditingIndex] = useState(null); // Track index of transaction being edited

    const categories = ["Food", "Transport", "Entertainment", "Bills", "Other"];

    // Add a new transaction or update an existing one
    const handleTransaction = () => {
        if (!amount || !description || !date || !category) return;
        const newTransaction = { amount: parseFloat(amount), description, date, category };

        if (editingIndex !== null) {
            // Editing an existing transaction
            const updatedTransactions = [...transactions];
            updatedTransactions[editingIndex] = newTransaction;
            setTransactions(updatedTransactions);
            setEditingIndex(null);
        } else {
            // Adding a new transaction
            setTransactions([...transactions, newTransaction]);
        }

        setAmount("");
        setDescription("");
        setDate("");
        setCategory("");
    };

    // Delete a transaction
    const deleteTransaction = (index) => {
        setTransactions(transactions.filter((_, i) => i !== index));
    };

    // Edit a transaction
    const editTransaction = (index) => {
        const transaction = transactions[index];
        setAmount(transaction.amount);
        setDescription(transaction.description);
        setDate(transaction.date);
        setCategory(transaction.category);
        setEditingIndex(index);
    };

    // Data for charts
    const categoryData = categories.map(cat => ({
        name: cat,
        value: transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
    }));

    const barChartData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString("default", { month: "short" });
        const existing = acc.find(item => item.month === month);
        if (existing) {
            existing.expense += t.amount;
        } else {
            acc.push({ month, expense: t.amount });
        }
        return acc;
    }, []);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            {/* Add/Edit Transaction Form */}
            <Card className="p-4 mb-4">
                <CardContent>
                    <h2 className="text-xl font-bold mb-2">{editingIndex !== null ? "Edit" : "Add"} Transaction</h2>
                    <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="mb-2" />
                    <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="mb-2" />
                    <Input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="mb-2" />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="mb-2 w-full border p-2 rounded">
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <Button onClick={handleTransaction}>
                        {editingIndex !== null ? "Update Transaction" : "Add Transaction"}
                    </Button>
                </CardContent>
            </Card>

            {/* Transaction List */}
            <Card className="p-4 mb-4">
                <CardContent>
                    <h2 className="text-xl font-bold mb-2">Transaction List</h2>
                    {transactions.length === 0 ? (
                        <p>No transactions added yet.</p>
                    ) : (
                        transactions.map((t, index) => (
                            <div key={index} className="border-b py-2 flex justify-between items-center">
                                <span>{t.date} - {t.description} - ${t.amount} ({t.category})</span>
                                <div>
                                    <Button size="small" onClick={() => editTransaction(index)}>Edit</Button>
                                    <Button size="small" color="error" onClick={() => deleteTransaction(index)}>Delete</Button>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Monthly Expenses Bar Chart */}
            <Card className="p-4 mb-4">
                <CardContent>
                    <h2 className="text-xl font-bold mb-2">Monthly Expenses</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="expense" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Category Breakdown Pie Chart */}
            <Card className="p-4 mb-4">
                <CardContent>
                    <h2 className="text-xl font-bold mb-2">Category Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                {categoryData.map((_, index) => <Cell key={index} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#0088fe"][index % 5]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default PersonalFinanceVisualizer;
