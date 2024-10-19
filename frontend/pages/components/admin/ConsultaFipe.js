import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const NavbarButtons = dynamic(() => import('./NavbarButtons'));

const ConsultaFipe = () => {
    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [anos, setAnos] = useState([]);
    const [marcaSelecionada, setMarcaSelecionada] = useState('');
    const [modeloSelecionado, setModeloSelecionado] = useState('');
    const [anoSelecionado, setAnoSelecionado] = useState('');
    const [fipeResult, setFipeResult] = useState(null);

    const [showMarcaDropdown, setShowMarcaDropdown] = useState(false);
    const [showModeloDropdown, setShowModeloDropdown] = useState(false);
    const [showAnoDropdown, setShowAnoDropdown] = useState(false);

    useEffect(() => {
        const fetchMarcas = async () => {
            const response = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
            const data = await response.json();
            setMarcas(data);
        };
        fetchMarcas();
    }, []);

    useEffect(() => {
        if (marcaSelecionada) {
            const fetchModelos = async () => {
                const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos`);
                const data = await response.json();
                setModelos(data.modelos);
            };
            fetchModelos();
        }
    }, [marcaSelecionada]);

    useEffect(() => {
        if (modeloSelecionado) {
            const fetchAnos = async () => {
                const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos`);
                const data = await response.json();
                setAnos(data);
            };
            fetchAnos();
        }
    }, [modeloSelecionado]);

    const handleConsultarFipe = async () => {
        if (!marcaSelecionada || !modeloSelecionado || !anoSelecionado) return;
        const response = await fetch(`/api/fipeAPI?marca=${marcaSelecionada}&modelo=${modeloSelecionado}&ano=${anoSelecionado}`);
        const data = await response.json();
        setFipeResult(data);
    };

    const toggleDropdown = (dropdown) => {
        switch (dropdown) {
            case 'marca':
                setShowMarcaDropdown(!showMarcaDropdown);
                break;
            case 'modelo':
                setShowModeloDropdown(!showModeloDropdown);
                break;
            case 'ano':
                setShowAnoDropdown(!showAnoDropdown);
                break;
            default:
                break;
        }
    };

    const handleSelect = (type, value, name) => {
        switch (type) {
            case 'marca':
                setMarcaSelecionada(value);
                setShowMarcaDropdown(false);
                setModeloSelecionado('');
                setAnoSelecionado('');
                break;
            case 'modelo':
                setModeloSelecionado(value);
                setShowModeloDropdown(false);
                setAnoSelecionado('');
                break;
            case 'ano':
                setAnoSelecionado(value);
                setShowAnoDropdown(false);
                break;
            default:
                break;
        }
    };

    return (
        <div className="max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-xl mx-auto bg-gray-50 p-4 sm:p-6 lg:p-12 rounded-xl shadow-lg">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold mb-6 text-gray-800 text-center">
                Consulta FIPE
            </h2>

            {/* Tutorial Block */}
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 sm:p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Como usar a consulta FIPE?</h3>
                <p className="text-base sm:text-lg mb-2">
                    Para consultar o valor de um veículo na Tabela FIPE, siga os passos abaixo:
                </p>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2">
                    <li>Selecione a marca do veículo.</li>
                    <li>Escolha o modelo do veículo na lista correspondente à marca selecionada.</li>
                    <li>Defina o ano de fabricação do veículo.</li>
                    <li>
                        Clique no botão <strong>Consultar FIPE</strong> para visualizar o valor do veículo.
                    </li>
                </ol>
                <p className="mt-4 text-base sm:text-lg">
                    Os resultados incluem o valor médio do veículo, o ano de fabricação, o tipo de combustível e o código FIPE.
                </p>
            </div>

            {/* Dropdown section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Marca */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('marca')}
                        className={`w-full bg-white text-left py-3 px-4 border rounded-lg shadow-sm focus:outline-none ${marcaSelecionada ? 'text-gray-700' : 'text-gray-500'}`}
                    >
                        {marcaSelecionada ? marcas.find((marca) => marca.codigo === marcaSelecionada)?.nome : 'Selecione a marca'}
                    </button>
                    {showMarcaDropdown && (
                        <ul className="absolute w-full mt-1 max-h-60 overflow-auto bg-white border rounded-lg shadow-lg z-10">
                            {marcas.map((marca) => (
                                <li
                                    key={marca.codigo}
                                    className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleSelect('marca', marca.codigo)}
                                >
                                    {marca.nome}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Modelo */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('modelo')}
                        disabled={!marcaSelecionada}
                        className={`w-full bg-white text-left py-3 px-4 border rounded-lg shadow-sm focus:outline-none ${modeloSelecionado ? 'text-gray-700' : 'text-gray-500'} ${!marcaSelecionada ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        {modeloSelecionado ? modelos.find((modelo) => modelo.codigo === modeloSelecionado)?.nome : 'Selecione o modelo'}
                    </button>
                    {showModeloDropdown && (
                        <ul className="absolute w-full mt-1 max-h-60 overflow-auto bg-white border rounded-lg shadow-lg z-10">
                            {modelos.map((modelo) => (
                                <li
                                    key={modelo.codigo}
                                    className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleSelect('modelo', modelo.codigo)}
                                >
                                    {modelo.nome}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Ano */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('ano')}
                        disabled={!modeloSelecionado}
                        className={`w-full bg-white text-left py-3 px-4 border rounded-lg shadow-sm focus:outline-none ${anoSelecionado ? 'text-gray-700' : 'text-gray-500'} ${!modeloSelecionado ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        {anoSelecionado ? anos.find((ano) => ano.codigo === anoSelecionado)?.nome : 'Selecione o ano'}
                    </button>
                    {showAnoDropdown && (
                        <ul className="absolute w-full mt-1 max-h-60 overflow-auto bg-white border rounded-lg shadow-lg z-10">
                            {anos.map((ano) => (
                                <li
                                    key={ano.codigo}
                                    className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleSelect('ano', ano.codigo)}
                                >
                                    {ano.nome}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Botão de consulta */}
            <button
                onClick={handleConsultarFipe}
                disabled={!anoSelecionado}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Consultar FIPE
            </button>

            {fipeResult && (
                <div className="mt-8 bg-white p-6 lg:p-8 rounded-lg shadow-md max-w-screen-md mx-auto">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-6 text-center">Detalhes do Veículo</h3>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
                        {/* Veículo */}
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-xs font-medium text-gray-500">Veículo</h4>
                            <p className="text-lg font-semibold text-gray-900">{fipeResult.Modelo}</p>
                        </div>

                        {/* Ano */}
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-xs font-medium text-gray-500">Ano</h4>
                            <p className="text-lg font-semibold text-gray-900">{fipeResult.AnoModelo}</p>
                        </div>

                        {/* Combustível */}
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-xs font-medium text-gray-500">Combustível</h4>
                            <p className="text-lg font-semibold text-gray-900">{fipeResult.Combustivel}</p>
                        </div>

                        {/* Código FIPE */}
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-xs font-medium text-gray-500">Código FIPE</h4>
                            <p className="text-lg font-semibold text-gray-900">{fipeResult.CodigoFipe}</p>
                        </div>
                    </div>

                    {/* Preço FIPE */}
                    <div className="mt-8 bg-gray-50 p-6 rounded-md text-center">
                        <h4 className="text-base font-medium text-gray-600">Preço Médio FIPE</h4>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{fipeResult.Valor}</p>
                    </div>
                </div>
            )}

            <NavbarButtons />
        </div>
    );
};

export default ConsultaFipe;
