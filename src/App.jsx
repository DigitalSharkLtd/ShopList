import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

const baseProductTranslations = {
  "BABY FOOD": { ru: "ДЕТСКОЕ ПИТАНИЕ", en: "BABY FOOD" },
  "BACON": { ru: "БЕКОН", en: "BACON" },
  "BREAD": { ru: "ХЛЕБ", en: "BREAD" },
  "BUTTER": { ru: "МАСЛО", en: "BUTTER" },
  "CAKE": { ru: "ТОРТ", en: "CAKE" },
  "CATSUP": { ru: "КЕТЧУП", en: "CATSUP" },
  "CEREAL": { ru: "ХЛОПЬЯ", en: "CEREAL" },
  "CHEESE": { ru: "СЫР", en: "CHEESE" },
  "COCOA": { ru: "КАКАО", en: "COCOA" },
  "COOKIES": { ru: "ПЕЧЕНЬЕ", en: "COOKIES" },
  "COFFEE": { ru: "КОФЕ", en: "COFFEE" },
  "CREAM": { ru: "СЛИВКИ", en: "CREAM" },
  "DELICATESS": { ru: "ДЕЛИКАТЕСЫ", en: "DELICATESS" },
  "EGGS": { ru: "ЯЙЦА", en: "EGGS" },
  "FISH": { ru: "РЫБА", en: "FISH" },
  "FLOUR": { ru: "МУКА", en: "FLOUR" },
  "FROZEN FOOD": { ru: "ЗАМОРОЗКА", en: "FROZEN FOOD" },
  "FRUIT": { ru: "ФРУКТЫ", en: "FRUIT" },
  "JAMS": { ru: "ВАРЕНЬЕ", en: "JAMS" },
  "JUICES": { ru: "СОКИ", en: "JUICES" },
  "MEAT": { ru: "МЯСО", en: "MEAT" },
  "MILK": { ru: "МОЛОКО", en: "MILK" },
  "MUSTARD": { ru: "ГОРЧИЦА", en: "MUSTARD" },
  "NOODLES": { ru: "ЛАПША", en: "NOODLES" },
  "OIL": { ru: "МАСЛО РАСТ.", en: "OIL" },
  "ONIONS": { ru: "ЛУК", en: "ONIONS" },
  "PEPPER": { ru: "ПЕРЕЦ", en: "PEPPER" },
  "POULTRY": { ru: "ПТИЦА", en: "POULTRY" },
  "POTATOES": { ru: "КАРТОФЕЛЬ", en: "POTATOES" },
  "RICE": { ru: "РИС", en: "RICE" },
  "SALT": { ru: "СОЛЬ", en: "SALT" },
  "SOAP": { ru: "МЫЛО", en: "SOAP" },
  "SOUPS": { ru: "СУПЫ", en: "SOUPS" },
  "SPAGHETTI": { ru: "СПАГЕТТИ", en: "SPAGHETTI" },
  "SPICES": { ru: "СПЕЦИИ", en: "SPICES" },
  "SUGAR": { ru: "САХАР", en: "SUGAR" },
  "TEA": { ru: "ЧАЙ", en: "TEA" },
  "VEGETABLE": { ru: "ОВОЩИ", en: "VEGETABLE" },
  "VINEGAR": { ru: "УКСУС", en: "VINEGAR" }
};

const translations = {
  ru: {
    title: "ShopList",
    add: "Добавить",
    delete: "Удалить",
    load: "Загр.",
    save: "Сохр.",
    clear: "Очистить",
    saved: "Сохранено!",
    default: "По умолчанию",
    selected: "Выбрано",
    noSelected: "Нет выбранных",
    units: { pcs: "шт", g: "г", kg: "кг", ml: "мл", l: "л", pack: "пак" },
    favorites: "Избранное",
    base: "Основные",
    custom: "Свои"
  },
  en: {
    title: "ShopList",
    add: "Add",
    delete: "Delete",
    load: "Load",
    save: "Save",
    clear: "Clear",
    saved: "Saved!",
    default: "Default",
    selected: "Selected",
    noSelected: "No items",
    units: { pcs: "pcs", g: "g", kg: "kg", ml: "ml", l: "l", pack: "pack" },
    favorites: "Favorites",
    base: "Base",
    custom: "Custom"
  }
};

const ShopList = () => {
  const baseProducts = Object.keys(baseProductTranslations);
  const [products, setProducts] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [shoppingList, setShoppingList] = useState({});
  const [profiles, setProfiles] = useState({});
  const [activeProfile, setActiveProfile] = useState("default");
  const [newProfileName, setNewProfileName] = useState("");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("pcs");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [language, setLanguage] = useState("ru");
  const [favorites, setFavorites] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [hiddenBaseProducts, setHiddenBaseProducts] = useState([]);

  const t = translations[language];

  const getTranslatedProductName = (product) => {
    if (baseProductTranslations[product]) {
      return baseProductTranslations[product][language];
    }
    return product;
  };

  const getOriginalProductName = (translatedName) => {
    for (const [key, translations] of Object.entries(baseProductTranslations)) {
      if (translations[language] === translatedName) {
        return key;
      }
    }
    return translatedName;
  };

  useEffect(() => {
    const savedList = localStorage.getItem('shoppingList');
    const savedProfiles = localStorage.getItem('profiles');
    const savedCustomProducts = localStorage.getItem('customProducts');
    const savedLang = localStorage.getItem('language');
    const savedFavorites = localStorage.getItem('favorites');
    const savedHiddenBase = localStorage.getItem('hiddenBaseProducts');
    
    const lang = savedLang || 'ru';
    setLanguage(lang);
    
    if (savedList) setShoppingList(JSON.parse(savedList));
    if (savedCustomProducts) setCustomProducts(JSON.parse(savedCustomProducts));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedHiddenBase) setHiddenBaseProducts(JSON.parse(savedHiddenBase));
    
    if (savedProfiles) {
      const profiles = JSON.parse(savedProfiles);
      if (profiles.default) {
        profiles.default.name = translations[lang].default;
      }
      setProfiles(profiles);
    } else {
      setProfiles({
        default: { name: translations[lang].default, items: {} }
      });
    }
  }, []);

  useEffect(() => {
    const visibleBaseProducts = baseProducts.filter(p => !hiddenBaseProducts.includes(p));
    setProducts([...visibleBaseProducts, ...customProducts]);
  }, [language, customProducts, hiddenBaseProducts]);

  useEffect(() => {
    if (Object.keys(shoppingList).length > 0) {
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    } else {
      localStorage.removeItem('shoppingList');
    }
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('profiles', JSON.stringify(profiles));
    localStorage.setItem('customProducts', JSON.stringify(customProducts));
    localStorage.setItem('language', language);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('hiddenBaseProducts', JSON.stringify(hiddenBaseProducts));
  }, [profiles, customProducts, language, favorites, hiddenBaseProducts]);

  const toggleLanguage = () => {
    const newLang = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLang);
    
    setProfiles(prev => {
      const updatedProfiles = {...prev};
      if (updatedProfiles.default) {
        updatedProfiles.default.name = translations[newLang].default;
      }
      return updatedProfiles;
    });
  };

  const toggleItem = (item) => {
    const originalName = getOriginalProductName(item);
    
    setShoppingList(prevList => {
      const newList = { ...prevList };
      
      if (newList[originalName]) {
        newList[originalName].selected = !newList[originalName].selected;
      } else {
        newList[originalName] = {
          selected: true,
          amount: 1,
          unit: 'pcs'
        };
      }
      
      return newList;
    });
  };

  const updateAmount = (item, value) => {
    const originalName = getOriginalProductName(item);
    
    setShoppingList(prevList => {
      const newList = { ...prevList };
      if (newList[originalName]) {
        newList[originalName].amount = value;
      }
      return newList;
    });
  };

  const updateUnit = (item, value) => {
    const originalName = getOriginalProductName(item);
    
    setShoppingList(prevList => {
      const newList = { ...prevList };
      if (newList[originalName]) {
        newList[originalName].unit = value;
      }
      return newList;
    });
  };

  const addNewProduct = () => {
    if (!newProductName.trim() || 
        customProducts.includes(newProductName.trim().toUpperCase()) || 
        baseProducts.includes(newProductName.trim().toUpperCase())) {
      return;
    }
    
    const formattedName = newProductName.trim().toUpperCase();
    setCustomProducts(prev => [...prev, formattedName]);
    setShoppingList(prev => ({
      ...prev,
      [formattedName]: {
        selected: true,
        amount: 1,
        unit: newProductUnit
      }
    }));
    
    setNewProductName("");
    setShowAddProduct(false);
  };

  const removeProductFromView = (item) => {
    const originalName = getOriginalProductName(item);
    
    if (baseProducts.includes(originalName)) {
      // Для базовых продуктов скрываем их
      setHiddenBaseProducts(prev => [...prev, originalName]);
    } else {
      // Для пользовательских продуктов удаляем полностью
      setCustomProducts(prev => prev.filter(p => p !== originalName));
      setFavorites(prev => prev.filter(p => p !== originalName));
    }
    
    // В любом случае удаляем из списка покупок
    setShoppingList(prev => {
      const newList = { ...prev };
      if (newList[originalName]) {
        delete newList[originalName];
      }
      return newList;
    });
  };

  const toggleFavorite = (item) => {
    const originalName = getOriginalProductName(item);
    
    setFavorites(prev => {
      if (prev.includes(originalName)) {
        return prev.filter(p => p !== originalName);
      } else {
        return [...prev, originalName];
      }
    });
  };

  const isFavorite = (item) => {
    const originalName = getOriginalProductName(item);
    return favorites.includes(originalName);
  };

  const saveProfile = () => {
    if (!newProfileName.trim()) return;
    
    const profileId = newProfileName.toLowerCase().replace(/\s+/g, '-');
    
    setProfiles(prevProfiles => ({
      ...prevProfiles,
      [profileId]: {
        name: newProfileName,
        items: { ...shoppingList }
      }
    }));
    
    setActiveProfile(profileId);
    setNewProfileName("");
    
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 1500);
  };

  const loadProfile = (profileId) => {
    if (profiles[profileId]) {
      setShoppingList({ ...profiles[profileId].items });
      setActiveProfile(profileId);
    }
  };

  const clearList = () => {
    if (window.confirm(language === 'ru' ? "Очистить список?" : "Clear list?")) {
      setShoppingList({});
    }
  };

  const getItemStyle = (item) => {
    const originalName = getOriginalProductName(item);
    return shoppingList[originalName] && shoppingList[originalName].selected 
      ? "bg-amber-100 border-amber-500" 
      : "bg-gray-100 border-gray-300";
  };

  const translateUnit = (unit) => {
    return t.units[unit] || unit;
  };

  const sortedProducts = () => {
    const favoriteProducts = products.filter(p => favorites.includes(getOriginalProductName(p)));
    const nonFavoriteProducts = products.filter(p => !favorites.includes(getOriginalProductName(p)));
    
    const translatedFavorites = favoriteProducts.map(p => ({
      original: p,
      translated: getTranslatedProductName(p)
    }));
    
    const translatedNonFavorites = nonFavoriteProducts.map(p => ({
      original: p,
      translated: getTranslatedProductName(p)
    }));
    
    const baseNonFavorites = translatedNonFavorites.filter(p => baseProducts.includes(p.original));
    const customNonFavorites = translatedNonFavorites.filter(p => !baseProducts.includes(p.original));
    
    return {
      favorites: translatedFavorites,
      base: baseNonFavorites,
      custom: customNonFavorites
    };
  };

  const groupedProducts = sortedProducts();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-xs">
      <header className="bg-amber-600 text-white p-2 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-lg font-bold">{t.title}</h1>
            <button 
              onClick={toggleLanguage}
              className="ml-2 bg-amber-700 text-white px-2 py-1 rounded text-xs"
            >
              {language === 'ru' ? 'EN' : 'RU'}
            </button>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={clearList}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              {t.clear}
            </button>
            <button 
              onClick={() => setDeleteMode(!deleteMode)}
              className={`px-2 py-1 rounded ${deleteMode ? 'bg-red-500' : 'bg-amber-700'}`}
            >
              {t.delete}
            </button>
            <button 
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="bg-white text-amber-600 px-2 py-1 rounded"
            >
              {t.add}
            </button>
          </div>
        </div>
      </header>
      
      {showAddProduct && (
        <div className="bg-white p-2 shadow-sm border-b">
          <div className="flex gap-1">
            <input
              type="text"
              placeholder={language === 'ru' ? "Название" : "Name"}
              className="flex-grow p-1 border rounded"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
            <select
              value={newProductUnit}
              onChange={(e) => setNewProductUnit(e.target.value)}
              className="w-12 p-1 border rounded"
            >
              {Object.keys(t.units).map(unit => (
                <option key={unit} value={unit}>{t.units[unit]}</option>
              ))}
            </select>
            <button 
              onClick={addNewProduct}
              className="bg-green-500 text-white p-1 rounded"
              disabled={!newProductName.trim()}
            >
              {t.add}
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white p-2 shadow-sm border-b">
        <div className="grid grid-cols-3 gap-1">
          <select 
            className="p-1 border rounded col-span-2"
            value={activeProfile}
            onChange={(e) => loadProfile(e.target.value)}
          >
            {Object.keys(profiles).map(profileId => (
              <option key={profileId} value={profileId}>
                {profiles[profileId].name}
              </option>
            ))}
          </select>
          <button 
            onClick={() => loadProfile(activeProfile)}
            className="bg-amber-500 text-white p-1 rounded"
          >
            {t.load}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-1 mt-1">
          <input
            type="text"
            placeholder={language === 'ru' ? "Имя профиля" : "Profile name"}
            className="p-1 border rounded col-span-2"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
          <button 
            onClick={saveProfile}
            className="bg-green-500 text-white p-1 rounded"
            disabled={!newProfileName.trim()}
          >
            {t.save}
          </button>
        </div>
        
        {showSaveSuccess && (
          <div className="mt-1 p-1 bg-green-100 text-green-800 rounded text-center">
            {t.saved}
          </div>
        )}
      </div>
      
      <main className="flex-grow p-1 overflow-y-auto">
        {groupedProducts.favorites.length > 0 && (
          <div className="mb-2">
            <h2 className="font-bold mb-1 text-amber-600">{t.favorites}</h2>
            <div className="grid grid-cols-1 gap-1">
              {groupedProducts.favorites.map(item => (
                <ProductItem 
                  key={item.original}
                  item={item.translated}
                  originalName={item.original}
                  toggleItem={toggleItem}
                  updateAmount={updateAmount}
                  updateUnit={updateUnit}
                  removeProductFromView={removeProductFromView}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  getItemStyle={getItemStyle}
                  shoppingList={shoppingList}
                  t={t}
                  deleteMode={deleteMode}
                  isBaseProduct={baseProducts.includes(item.original)}
                />
              ))}
            </div>
          </div>
        )}
        
        {groupedProducts.base.length > 0 && (
          <div className="mb-2">
            <h2 className="font-bold mb-1">{t.base}</h2>
            <div className="grid grid-cols-1 gap-1">
              {groupedProducts.base.map(item => (
                <ProductItem 
                  key={item.original}
                  item={item.translated}
                  originalName={item.original}
                  toggleItem={toggleItem}
                  updateAmount={updateAmount}
                  updateUnit={updateUnit}
                  removeProductFromView={removeProductFromView}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  getItemStyle={getItemStyle}
                  shoppingList={shoppingList}
                  t={t}
                  deleteMode={deleteMode}
                  isBaseProduct={true}
                />
              ))}
            </div>
          </div>
        )}
        
        {groupedProducts.custom.length > 0 && (
          <div className="mb-2">
            <h2 className="font-bold mb-1">{t.custom}</h2>
            <div className="grid grid-cols-1 gap-1">
              {groupedProducts.custom.map(item => (
                <ProductItem 
                  key={item.original}
                  item={item.translated}
                  originalName={item.original}
                  toggleItem={toggleItem}
                  updateAmount={updateAmount}
                  updateUnit={updateUnit}
                  removeProductFromView={removeProductFromView}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  getItemStyle={getItemStyle}
                  shoppingList={shoppingList}
                  t={t}
                  deleteMode={deleteMode}
                  isBaseProduct={false}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white p-2 shadow-t border-t">
        <h2 className="font-bold mb-1">
          {t.selected} ({Object.keys(shoppingList).filter(item => shoppingList[item].selected).length})
        </h2>
        <div className="max-h-24 overflow-y-auto">
          {Object.keys(shoppingList).filter(item => shoppingList[item].selected).length > 0 ? (
            <div className="grid grid-cols-2 gap-1">
              {Object.keys(shoppingList)
                .filter(item => shoppingList[item].selected)
                .map(item => (
                  <div key={item} className="py-1 border-b flex justify-between">
                    <span>{getTranslatedProductName(item)}</span>
                    <span className="font-medium">
                      {shoppingList[item].amount} {translateUnit(shoppingList[item].unit)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">{t.noSelected}</p>
          )}
        </div>
      </footer>
    </div>
  );
};

const ProductItem = ({ 
  item, 
  originalName,
  toggleItem, 
  updateAmount, 
  updateUnit, 
  removeProductFromView,
  toggleFavorite,
  isFavorite,
  getItemStyle,
  shoppingList,
  t,
  deleteMode,
  isBaseProduct
}) => {
  const starColor = isFavorite(item) ? "text-yellow-500" : "text-gray-400";
  const isSelected = shoppingList[originalName]?.selected;
  
  return (
    <div className={`flex items-center border p-1 rounded ${getItemStyle(item)}`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button 
            onClick={() => toggleFavorite(item)}
            className={`mr-1 ${starColor} hover:text-yellow-600`}
          >
            ★
          </button>
          
          {!deleteMode && (
            <button 
              onClick={() => toggleItem(item)}
              className={`relative w-7 h-4 flex items-center rounded-full p-1 mr-2
                ${isSelected ? 'bg-amber-500' : 'bg-gray-300'}`}
            >
              <span 
                className={`absolute left-0.5 bg-white w-3 h-3 rounded-full shadow transform transition-transform
                  ${isSelected ? 'translate-x-3' : ''}`}
              />
            </button>
          )}
          <span className="font-medium">{item}</span>
        </div>
        
        <div className="flex items-center">
          {isSelected && !deleteMode && (
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min="1"
                value={shoppingList[originalName].amount}
                onChange={(e) => updateAmount(item, e.target.value)}
                className="w-14 p-1 border rounded text-center"
              />
              <select
                value={shoppingList[originalName].unit}
                onChange={(e) => updateUnit(item, e.target.value)}
                className="w-14 p-1 border rounded"
              >
                {Object.keys(t.units).map(unit => (
                  <option key={unit} value={unit}>{t.units[unit]}</option>
                ))}
              </select>
            </div>
          )}
          
          {deleteMode && (
            <button 
              onClick={() => removeProductFromView(item)}
              className="text-red-500 font-bold px-2 ml-2 text-lg bg-red-100 rounded-full leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopList;
