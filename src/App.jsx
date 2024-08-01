import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
       <>{
        data.length>0 &&  <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={`pro_${index}`}>
              {item.variants.edges.map((variant, ind) => (
                <tr key={ind}>
                  <td>{variant.node.displayName}</td>
                  <td>{variant.node.price}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
       }
       </>
      )}
    </div>
  );
}

export default App;
