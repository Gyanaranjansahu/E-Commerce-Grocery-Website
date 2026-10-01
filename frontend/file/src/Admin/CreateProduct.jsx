import React, { useState } from 'react';
import Costume from '../services/costume';

const CreateProduct = () => {
  const { handleCreate } = Costume();
  const [selectedFile, setSelectedFile] = useState(null);

  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  });

  const { name, description, price, quantity, category } = data;

  const categories = [
    'Fruits',
    'Vegetables',
    'Dairy',
    'Meat',
    'Beverages',
    'Snacks',
  ];

  function handleItem(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleForm(e) {
    e.preventDefault();

    // Send simple data object directly
    await handleCreate({
      ...data,
      image: selectedFile,
    });
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 sm:p-8 selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-4xl bg-[#111827]/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header / Breadcrumb Bar */}
        <div className="px-8 py-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <span>Catalog</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Inventory</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Add New Product</h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure inventory details, pricing, and visual assets for your store.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Catalog
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleForm} className="p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Core Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Title */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Product Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleItem}
                  required
                  placeholder="e.g. Organic Cavendish Bananas"
                  className="w-full bg-[#161f30] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition shadow-inner"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={description}
                  onChange={handleItem}
                  placeholder="Provide detailed specifications, ingredients, or storage guidelines..."
                  className="w-full bg-[#161f30] border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition resize-none shadow-inner"
                />
              </div>

              {/* Pricing & Stock Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Base Price <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={handleItem}
                      required
                      placeholder="0.00"
                      className="w-full bg-[#161f30] border border-slate-700/80 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Stock Units <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    value={quantity}
                    onChange={handleItem}
                    required
                    placeholder="e.g. 150"
                    className="w-full bg-[#161f30] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Classification & Media (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Category Select */}
              <div>
                <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Category <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={handleItem}
                    required
                    className="w-full appearance-none bg-[#161f30] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition shadow-inner cursor-pointer"
                  >
                    <option value="" disabled className="text-slate-500">
                      Select catalog section
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#111827] text-slate-200">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Media Asset Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Display Asset
                </label>
                <div className="relative border-2 border-dashed border-slate-700/80 hover:border-indigo-500/60 rounded-xl p-6 bg-[#161f30]/40 transition text-center group cursor-pointer">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-indigo-600/20 group-hover:text-indigo-400 text-slate-400 transition">
                      <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium text-indigo-400 hover:underline">Click to upload</span>
                      <span className="text-slate-400"> or drag and drop</span>
                    </div>
                    <p className="text-[11px] text-slate-500">PNG, JPG, or WEBP up to 5MB</p>
                    {selectedFile && (
                      <div className="mt-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200"
            >
              Publish Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;