import React, { useState, useEffect } from 'react';
import { FaCarSide, FaCalendarAlt, FaGasPump, FaBarcode } from 'react-icons/fa';
import Select from 'react-select';

const ConsultaFipe = () => {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState(null);
  const [fipeResult, setFipeResult] = useState(null);
  const [loadingMarcas, setLoadingMarcas] = useState(false);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [loadingAnos, setLoadingAnos] = useState(false);
  const [loadingFipe, setLoadingFipe] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar marcas
  useEffect(() => {
    const fetchMarcas = async () => {
      setLoadingMarcas(true);
      try {
        const cachedMarcas = sessionStorage.getItem('marcas');
        if (cachedMarcas) {
          setMarcas(JSON.parse(cachedMarcas));
        } else {
          const response = await fetch(
            'https://parallelum.com.br/fipe/api/v1/carros/marcas'
          );
          const data = await response.json();
          setMarcas(data);
          sessionStorage.setItem('marcas', JSON.stringify(data));
        }
      } catch (error) {
        setError('Erro ao carregar as marcas.');
      } finally {
        setLoadingMarcas(false);
      }
    };
    fetchMarcas();
  }, []);

  // Função para buscar modelos
  useEffect(() => {
    const fetchModelos = async () => {
      if (marcaSelecionada) {
        setLoadingModelos(true);
        setModeloSelecionado(null);
        setAnoSelecionado(null);
        setFipeResult(null);
        try {
          const cachedModelos = sessionStorage.getItem(
            `modelos-${marcaSelecionada.value}`
          );
          if (cachedModelos) {
            setModelos(JSON.parse(cachedModelos));
          } else {
            const response = await fetch(
              `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada.value}/modelos`
            );
            const data = await response.json();
            setModelos(data.modelos);
            sessionStorage.setItem(
              `modelos-${marcaSelecionada.value}`,
              JSON.stringify(data.modelos)
            );
          }
        } catch (error) {
          setError('Erro ao carregar os modelos.');
        } finally {
          setLoadingModelos(false);
        }
      }
    };
    fetchModelos();
  }, [marcaSelecionada]);

  // Função para buscar anos
  useEffect(() => {
    const fetchAnos = async () => {
      if (modeloSelecionado) {
        setLoadingAnos(true);
        setAnoSelecionado(null);
        setFipeResult(null);
        try {
          const cachedAnos = sessionStorage.getItem(
            `anos-${modeloSelecionado.value}`
          );
          if (cachedAnos) {
            setAnos(JSON.parse(cachedAnos));
          } else {
            const response = await fetch(
              `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada.value}/modelos/${modeloSelecionado.value}/anos`
            );
            const data = await response.json();
            setAnos(data);
            sessionStorage.setItem(
              `anos-${modeloSelecionado.value}`,
              JSON.stringify(data)
            );
          }
        } catch (error) {
          setError('Erro ao carregar os anos.');
        } finally {
          setLoadingAnos(false);
        }
      }
    };
    fetchAnos();
  }, [modeloSelecionado, marcaSelecionada]);

  const handleConsultarFipe = async () => {
    try {
      if (!marcaSelecionada || !modeloSelecionado || !anoSelecionado) return;
      setLoadingFipe(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/fipeAPI?marca=${marcaSelecionada.value}&modelo=${modeloSelecionado.value}&ano=${anoSelecionado.value}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar dados da FIPE.');
      }

      const data = await response.json();
      setFipeResult(data);
    } catch (error) {
      setError('Erro na consulta FIPE.');
    } finally {
      setLoadingFipe(false);
    }
  };

  // Transformar dados para o formato do React Select
  const marcasOptions = marcas.map((marca) => ({
    value: marca.codigo,
    label: marca.nome,
  }));

  const modelosOptions = modelos.map((modelo) => ({
    value: modelo.codigo,
    label: modelo.nome,
  }));

  const anosOptions = anos.map((ano) => ({
    value: ano.codigo,
    label: ano.nome,
  }));

  const VehicleDetails = ({ data }) => (
    <div className="mt-8 bg-white p-6 lg:p-8 rounded-lg shadow-md max-w-screen-md mx-auto">
      <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-6 text-center">
        Detalhes do Veículo
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-center">
          <FaCarSide className="text-blue-600 mr-3 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Veículo</p>
            <p className="text-lg font-semibold text-gray-900">{data.Modelo}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaCalendarAlt className="text-blue-600 mr-3 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Ano</p>
            <p className="text-lg font-semibold text-gray-900">
              {data.AnoModelo}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <FaGasPump className="text-blue-600 mr-3 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Combustível</p>
            <p className="text-lg font-semibold text-gray-900">
              {data.Combustivel}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <FaBarcode className="text-blue-600 mr-3 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Código FIPE</p>
            <p className="text-lg font-semibold text-gray-900">
              {data.CodigoFipe}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-blue-50 p-6 rounded-md text-center">
        <h4 className="text-base font-medium text-gray-600">
          Preço Médio FIPE
        </h4>
        <p className="text-2xl font-bold text-gray-900 mt-2">{data.Valor}</p>
        <p className="text-sm text-gray-500 mt-1">
          Data da consulta: {data.DataConsulta}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6 text-gray-800 text-center">
        Consulta Tabela FIPE
      </h2>

      {/* Tutorial */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-blue-600">
          Como funciona?
        </h3>
        <p className="text-base sm:text-lg mb-2 text-gray-700">
          Consulte o valor de um veículo na Tabela FIPE em poucos passos:
        </p>
        <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-gray-700">
          <li>Escolha a marca do veículo.</li>
          <li>Selecione o modelo desejado.</li>
          <li>Informe o ano de fabricação.</li>
          <li>
            Clique em <strong>Consultar</strong> para ver o resultado.
          </li>
        </ol>
        <p className="mt-4 text-red-600 text-sm">
          * As consultas estão disponíveis apenas para carros.
        </p>
      </div>

      {/* Formulário de Consulta */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Marca */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Marca</label>
            <Select
              options={marcasOptions}
              value={marcaSelecionada}
              onChange={(selectedOption) => setMarcaSelecionada(selectedOption)}
              isLoading={loadingMarcas}
              placeholder="Selecione a marca"
              noOptionsMessage={() => 'Nenhuma marca encontrada'}
            />
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Modelo</label>
            <Select
              options={modelosOptions}
              value={modeloSelecionado}
              onChange={(selectedOption) =>
                setModeloSelecionado(selectedOption)
              }
              isLoading={loadingModelos}
              placeholder="Selecione o modelo"
              noOptionsMessage={() => 'Nenhum modelo encontrado'}
              isDisabled={!marcaSelecionada}
            />
          </div>

          {/* Ano */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Ano</label>
            <Select
              options={anosOptions}
              value={anoSelecionado}
              onChange={(selectedOption) => setAnoSelecionado(selectedOption)}
              isLoading={loadingAnos}
              placeholder="Selecione o ano"
              noOptionsMessage={() => 'Nenhum ano encontrado'}
              isDisabled={!modeloSelecionado}
            />
          </div>
        </div>

        {/* Botão de Consulta */}
        <button
          onClick={handleConsultarFipe}
          disabled={!anoSelecionado || loadingFipe}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loadingFipe ? 'Consultando...' : 'Consultar'}
        </button>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Resultado da Consulta */}
      {fipeResult && !error && <VehicleDetails data={fipeResult} />}
    </div>
  );
};

export default ConsultaFipe;
