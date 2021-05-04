const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData
    });
  
    useEffect(() => {
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true
        };
      default:
        throw new Error();
    }
  };
  // App that gets data from Hacker News url
  function App() {
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("Austin");
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      "https://goweather.herokuapp.com/weather/tyler",
      {
        forecast: []
      }
    );
    let weather = data.forecast;
    return (
      <Fragment>
        <form
          onSubmit={event => {
            doFetch(`https://goweather.herokuapp.com/weather/${query}`);
            console.log(`https://goweather.herokuapp.com/weather/${query}`);
            event.preventDefault();
          }}
        >
          <input
            className='search_input'
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <button className='search_button' type="submit">Search</button>
        </form>
  
        {isError && <div>Something went wrong ...</div>}
  
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <nav>
          <ul className='temp_ul'>
            {weather.map(item => (
              <li className='temp_li' key={item.day}>
                <p className='temp_p'>On day {item.day}, the temperature is {item.temperature}</p>
              </li>
            ))}
          </ul>
          <p className="p_info">*Type in a city like Austin</p>
          </nav>
        )}
      </Fragment>
    );
  }
  
  // ========================================
  ReactDOM.render(<App />, document.getElementById("root"));
  