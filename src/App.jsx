import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moneyFormat,setMoneyFormat] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://product-search-backend.vercel.app/products");
        const jsonData = await res.json();
        setData(jsonData.products);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(data); 
  }, [data]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`https://product-search-backend.vercel.app/products?query=${search}`);
      const jsonData = await res.json();
      setData(jsonData.products);
      setMoneyFormat(jsonData.shop.currencyFormats.moneyFormat)
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
<div>
<h1 className="text-3xl font-bold m-10">Products</h1>
      <form onSubmit={handleSubmit} className="ml-10 mt-10">
        <input
        className="p-1 border "
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
        <button className="border border-black px-4 py2 pl-2 " type="submit">Search</button>
      </form>
</div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
       <>{
        data.length>0 && <div className="text-center">
          <h2 className="text-xl font-bold my-5">Product Title : {data[0].title} </h2>
          <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b-2 border-gray-200">Title</th>
            <th className="px-4 py-2 border-b-2 border-gray-200">Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={`pro_${index}`}>
              {item.variants.edges.map((variant, ind) => (
                <tr key={ind} className="hover:bg-gray-100">
                  {console.log(moneyFormat)}
                  <td className="px-4 py-2 border-b border-gray-200">{variant.node.title}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{moneyFormat.replace('{{amount}}',variant.node.price)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
        </div>
      
       }
       </>
      )}
    </div>
  );
}

export default App;
