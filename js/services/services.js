const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });
    return await res.json(); // async - await - для создания очереди выполнения 
};


const getData = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Ошибка получения данных ${res.status}, ${url}`);
    }
    return await res.json();
};


export {
    postData
};

export {
    getData
};