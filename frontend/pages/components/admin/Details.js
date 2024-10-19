import React, { useState } from 'react';
import axios from 'axios';
import { FaCarSide, FaClipboardList, FaCloudUploadAlt, FaCouch, FaFileAlt, FaImages, FaInfoCircle, FaLock, FaMicrochip, FaPaintBrush, FaPencilAlt, FaShieldAlt, FaTimes } from 'react-icons/fa';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';

export default function Details({ vehicle, onClose }) {
    const [editableVehicle, setEditableVehicle] = useState(vehicle);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableVehicle({ ...editableVehicle, [name]: value });
    };

    const handleSave = async () => {
        try {
            const route = vehicle.tipo === 'carro' ? 'carros' : 'motos';
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/${route}/${editableVehicle.customId}`, editableVehicle);
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error('Erro ao salvar as alterações:', error);
        }
    };

    // Renderiza cada seção baseada no botão clicado
    const renderSection = () => {
        switch (activeTab) {
            case 0: // Informações Básicas
                return (
                    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Informações Básicas</h2>
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { key: 'marca', label: 'Marca' },
                                    { key: 'modelo', label: 'Modelo' },
                                    { key: 'tipoDeCarro', label: 'Tipo de Carro' },
                                    { key: 'anoFabricacao', label: 'Ano de Fabricação' },
                                    { key: 'anoModelo', label: 'Ano do Modelo' },
                                    { key: 'transmissao', label: 'Transmissão' },
                                    { key: 'cor', label: 'Cor' },
                                ].map((field) => (
                                    <div key={field.key} className="relative">
                                        {/* Campo de Label */}
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>

                                        {isEditing ? (
                                            <div className="relative">
                                                {/* Campo de Input editável */}
                                                <input
                                                    type="text"
                                                    name={field.key}
                                                    value={editableVehicle[field.key]}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                {/* Valor do campo quando não editável */}
                                                <p className="text-base text-gray-700">{editableVehicle[field.key] || '—'}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Botões de Ações Globais (Editar/Salvar/Cancelar) */}
                            <div className="flex justify-end mt-8 space-x-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition duration-200 ease-in-out"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                        >
                                            Salvar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                    >
                                        <FaPencilAlt className="mr-2" />
                                        Editar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                );

            case 1: // Ficha Técnica
                return (
                    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Ficha Técnica</h2>
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { key: 'quilometragem', label: 'Quilometragem', suffix: 'km' },
                                    { key: 'combustivel', label: 'Combustível' },
                                    { key: 'direcao', label: 'Direção' },
                                    { key: 'potencia', label: 'Potência', suffix: 'CV' },
                                    { key: 'motor', label: 'Motor' },
                                    { key: 'torque', label: 'Torque', suffix: 'kgfm' },
                                    { key: 'numeroDePortas', label: 'Número de Portas' },
                                    { key: 'tracao', label: 'Tração' },
                                    { key: 'freios', label: 'Freios' },
                                    { key: 'capacidadePortaMalas', label: 'Capacidade do Porta-Malas', suffix: 'L' },
                                ].map((field) => (
                                    <div key={field.key} className="relative">
                                        {/* Campo de Label */}
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>

                                        {isEditing ? (
                                            <div className="relative">
                                                {/* Campo de Input editável */}
                                                <input
                                                    type="text"
                                                    name={field.key}
                                                    value={editableVehicle[field.key]}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                />
                                                {field.suffix && (
                                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                        {field.suffix}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                {/* Valor do campo quando não editável */}
                                                <p className="text-base text-gray-700">
                                                    {editableVehicle[field.key] || '—'} {field.suffix && field.suffix}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Botões de Ações Globais (Editar/Salvar/Cancelar) */}
                            <div className="flex justify-end mt-8 space-x-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition duration-200 ease-in-out"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                        >
                                            Salvar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                    >
                                        <FaPencilAlt className="mr-2" />
                                        Editar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                );

            case 2: // Documentação e Regularização
                return (
                    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Documentação e Regularização</h2>
                        <form onSubmit={handleSave}>
                            <div className="space-y-6">
                                {[
                                    { key: 'placa', label: 'Placa' },
                                    { key: 'chassi', label: 'Chassi' },
                                    { key: 'crlv', label: 'CRLV' },
                                    { key: 'ipva', label: 'IPVA' },
                                    { key: 'dpvat', label: 'DPVAT' },
                                ].map((field) => (
                                    <div key={field.key} className="relative">
                                        {/* Campo de Label */}
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>

                                        {isEditing ? (
                                            <div className="relative">
                                                {/* Campo de Input editável */}
                                                <input
                                                    type="text"
                                                    name={field.key}
                                                    value={editableVehicle[field.key]}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                {/* Valor do campo quando não editável */}
                                                <p className="text-base text-gray-700">{editableVehicle[field.key] || '—'}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Campos de Checkbox */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Com Multas? */}
                                    <div className="flex items-center">
                                        <label className="text-sm font-medium text-gray-700 mr-4">Com Multas?</label>
                                        {isEditing ? (
                                            <input
                                                type="checkbox"
                                                name="comMultas"
                                                checked={editableVehicle.comMultas}
                                                onChange={(e) =>
                                                    setEditableVehicle({
                                                        ...editableVehicle,
                                                        comMultas: e.target.checked,
                                                    })
                                                }
                                                className="h-5 w-5 text-blue-600"
                                            />
                                        ) : (
                                            <p className="text-base text-gray-700">{editableVehicle.comMultas ? 'Sim' : 'Não'}</p>
                                        )}
                                    </div>

                                    {/* Veículo de Leilão */}
                                    <div className="flex items-center">
                                        <label className="text-sm font-medium text-gray-700 mr-4">Veículo de Leilão?</label>
                                        {isEditing ? (
                                            <input
                                                type="checkbox"
                                                name="deLeilao"
                                                checked={editableVehicle.deLeilao}
                                                onChange={(e) =>
                                                    setEditableVehicle({
                                                        ...editableVehicle,
                                                        deLeilao: e.target.checked,
                                                    })
                                                }
                                                className="h-5 w-5 text-blue-600"
                                            />
                                        ) : (
                                            <p className="text-base text-gray-700">{editableVehicle.deLeilao ? 'Sim' : 'Não'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Botões de Ações Globais (Editar/Salvar/Cancelar) */}
                            <div className="flex justify-end mt-8 space-x-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition duration-200 ease-in-out"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                        >
                                            Salvar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                    >
                                        <FaPencilAlt className="mr-2" />
                                        Editar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                );


            case 3: // Opcionais do Veículo
                return (
                    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Opcionais do Veículo</h2>
                        <form onSubmit={handleSave}>
                            {/* Conforto */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FaCouch className="text-2xl text-blue-600 mr-2" />
                                    <h3 className="text-2xl font-semibold text-gray-700">Conforto</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { key: 'arCondicionado', label: 'Ar Condicionado' },
                                        { key: 'bancosCouro', label: 'Bancos de Couro' },
                                        { key: 'vidroEletrico', label: 'Vidro Elétrico' },
                                        { key: 'volanteMultifuncional', label: 'Volante Multifuncional' },
                                    ].map((opcional) => (
                                        <div key={opcional.key} className="flex items-center">
                                            {isEditing ? (
                                                <input
                                                    type="checkbox"
                                                    name={`opcionais.${opcional.key}`}
                                                    checked={editableVehicle.opcionais[opcional.key]}
                                                    onChange={(e) =>
                                                        setEditableVehicle({
                                                            ...editableVehicle,
                                                            opcionais: {
                                                                ...editableVehicle.opcionais,
                                                                [opcional.key]: e.target.checked,
                                                            },
                                                        })
                                                    }
                                                    className="h-5 w-5 text-blue-600"
                                                />
                                            ) : (
                                                <span
                                                    className={`h-4 w-4 mr-2 rounded-full ${editableVehicle.opcionais[opcional.key] ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                ></span>
                                            )}
                                            <label className="text-gray-700">{opcional.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tecnologia */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FaMicrochip className="text-2xl text-blue-600 mr-2" />
                                    <h3 className="text-2xl font-semibold text-gray-700">Tecnologia</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { key: 'bluetooth', label: 'Bluetooth' },
                                        { key: 'centralMultimidia', label: 'Central Multimídia' },
                                        { key: 'sistemaNavegacao', label: 'Sistema de Navegação' },
                                        { key: 'conexaoUSB', label: 'Conexão USB' },
                                        { key: 'computadorBordo', label: 'Computador de Bordo' },
                                    ].map((opcional) => (
                                        <div key={opcional.key} className="flex items-center">
                                            {isEditing ? (
                                                <input
                                                    type="checkbox"
                                                    name={`opcionais.${opcional.key}`}
                                                    checked={editableVehicle.opcionais[opcional.key]}
                                                    onChange={(e) =>
                                                        setEditableVehicle({
                                                            ...editableVehicle,
                                                            opcionais: {
                                                                ...editableVehicle.opcionais,
                                                                [opcional.key]: e.target.checked,
                                                            },
                                                        })
                                                    }
                                                    className="h-5 w-5 text-blue-600"
                                                />
                                            ) : (
                                                <span
                                                    className={`h-4 w-4 mr-2 rounded-full ${editableVehicle.opcionais[opcional.key] ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                ></span>
                                            )}
                                            <label className="text-gray-700">{opcional.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Segurança */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FaShieldAlt className="text-2xl text-blue-600 mr-2" />
                                    <h3 className="text-2xl font-semibold text-gray-700">Segurança</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { key: 'airbag', label: 'Airbag' },
                                        { key: 'alarme', label: 'Alarme' },
                                        { key: 'controleTracao', label: 'Controle de Tração' },
                                        { key: 'assistenteRampa', label: 'Assistente de Rampa' },
                                        { key: 'freioEstacionamentoEletrico', label: 'Freio de Estacionamento Elétrico' },
                                    ].map((opcional) => (
                                        <div key={opcional.key} className="flex items-center">
                                            {isEditing ? (
                                                <input
                                                    type="checkbox"
                                                    name={`opcionais.${opcional.key}`}
                                                    checked={editableVehicle.opcionais[opcional.key]}
                                                    onChange={(e) =>
                                                        setEditableVehicle({
                                                            ...editableVehicle,
                                                            opcionais: {
                                                                ...editableVehicle.opcionais,
                                                                [opcional.key]: e.target.checked,
                                                            },
                                                        })
                                                    }
                                                    className="h-5 w-5 text-blue-600"
                                                />
                                            ) : (
                                                <span
                                                    className={`h-4 w-4 mr-2 rounded-full ${editableVehicle.opcionais[opcional.key] ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                ></span>
                                            )}
                                            <label className="text-gray-700">{opcional.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Estética e Outros */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FaPaintBrush className="text-2xl text-blue-600 mr-2" />
                                    <h3 className="text-2xl font-semibold text-gray-700">Estética e Outros</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { key: 'tetoSolar', label: 'Teto Solar' },
                                        { key: 'faroisNeblina', label: 'Faróis de Neblina' },
                                        { key: 'rodasLigaLeve', label: 'Rodas de Liga Leve' },
                                        { key: 'blindado', label: 'Blindado' },
                                        { key: 'tracao4x4', label: 'Tração 4x4' },
                                    ].map((opcional) => (
                                        <div key={opcional.key} className="flex items-center">
                                            {isEditing ? (
                                                <input
                                                    type="checkbox"
                                                    name={`opcionais.${opcional.key}`}
                                                    checked={editableVehicle.opcionais[opcional.key]}
                                                    onChange={(e) =>
                                                        setEditableVehicle({
                                                            ...editableVehicle,
                                                            opcionais: {
                                                                ...editableVehicle.opcionais,
                                                                [opcional.key]: e.target.checked,
                                                            },
                                                        })
                                                    }
                                                    className="h-5 w-5 text-blue-600"
                                                />
                                            ) : (
                                                <span
                                                    className={`h-4 w-4 mr-2 rounded-full ${editableVehicle.opcionais[opcional.key] ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                ></span>
                                            )}
                                            <label className="text-gray-700">{opcional.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex justify-end mt-6 space-x-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition duration-200 ease-in-out"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                        >
                                            Salvar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                    >
                                        <FaPencilAlt className="mr-2" />
                                        Editar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                );

            case 4: // Valores e Imagens
                return (
                    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Valores e Imagens</h2>
                        <form onSubmit={handleSave}>
                            {/* Valor de Compra */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    Valor de Compra
                                    <span className="ml-2 text-gray-500 relative group">
                                        <HiOutlineQuestionMarkCircle className="text-xl" />
                                        {/* Tooltip */}
                                        <div className="absolute left-0 -top-12 w-56 p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Este é o valor pelo qual o veículo foi adquirido.
                                        </div>
                                    </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="valorCompra"
                                            value={editableVehicle.valorCompra}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        />
                                    ) : (
                                        <p className="pl-10 py-2 text-gray-700">
                                            {parseFloat(editableVehicle.valorCompra || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Valor de Venda */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    Valor de Venda
                                    <span className="ml-2 text-gray-500 relative group">
                                        <HiOutlineQuestionMarkCircle className="text-xl" />
                                        {/* Tooltip */}
                                        <div className="absolute left-0 -top-12 w-56 p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Este é o valor pelo qual o veículo será vendido.
                                        </div>
                                    </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="valorVenda"
                                            value={editableVehicle.valorVenda}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        />
                                    ) : (
                                        <p className="pl-10 py-2 text-gray-700">
                                            {parseFloat(editableVehicle.valorVenda || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Valor FIPE */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2">Valor FIPE</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="valorFIPE"
                                            value={editableVehicle.valorFIPE}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        />
                                    ) : (
                                        <p className="pl-10 py-2 text-gray-700">
                                            {parseFloat(editableVehicle.valorFIPE || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Upload de Imagens */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2">Imagens do Veículo</label>
                                <div
                                    className="flex flex-col items-center justify-center w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() => document.getElementById('upload').click()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const files = Array.from(e.dataTransfer.files);
                                        setEditableVehicle({ ...editableVehicle, imagens: [...editableVehicle.imagens, ...files] });
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setEditableVehicle({
                                                        ...editableVehicle,
                                                        imagens: [...editableVehicle.imagens, ...Array.from(e.target.files)],
                                                    })
                                                }
                                                className="hidden"
                                                id="upload"
                                            />
                                            <FaCloudUploadAlt className="text-6xl text-gray-400 mb-2" />
                                            <p className="text-gray-600">
                                                Arraste e solte as imagens aqui ou <span className="text-blue-600 underline">clique para selecionar</span>
                                            </p>
                                        </>
                                    ) : (
                                        <div className="text-gray-600 mb-4">
                                            <p>Imagens do veículo:</p>
                                        </div>
                                    )}
                                </div>

                                {/* Visualização das Imagens */}
                                {editableVehicle.imagens.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                        {editableVehicle.imagens.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image instanceof File ? URL.createObjectURL(image) : image}
                                                    alt={`Imagem ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg shadow"
                                                />
                                                {isEditing && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updatedImages = editableVehicle.imagens.filter((_, i) => i !== index);
                                                            setEditableVehicle({ ...editableVehicle, imagens: updatedImages });
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                                                    >
                                                        <FaTimes className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {/* Overlay ao passar o mouse */}
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center">
                                                    {isEditing && (
                                                        <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">Clique para remover</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex justify-end mt-6 space-x-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition duration-200 ease-in-out"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                        >
                                            Salvar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out"
                                    >
                                        <FaPencilAlt className="mr-2" />
                                        Editar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                );



            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fundo com Efeito de Desfoque */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      
          {/* Container do Modal */}
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-xl p-6 z-50 overflow-y-auto">
            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <FaTimes size={20} />
            </button>
      
            {/* Navegação por Abas */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex justify-between" aria-label="Tabs">
                {[
                  { label: 'Informações', icon: <FaInfoCircle /> },
                  { label: 'Ficha Técnica', icon: <FaClipboardList /> },
                  { label: 'Documentação', icon: <FaFileAlt /> },
                  { label: 'Opcionais', icon: <FaCarSide /> },
                  { label: 'Valores e Imagens', icon: <FaImages /> },
                ].map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-300 ${
                      activeTab === index
                        ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`text-lg transition-transform duration-300 ${activeTab === index ? 'scale-110' : 'scale-100'}`}>
                      {tab.icon}
                    </span>
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
      
            {/* Seção de Conteúdo */}
            <div className="mt-6">
              {renderSection()}
            </div>
      
            {/* Botão de Salvar */}
            {isEditing && (
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>
        </div>
      );

}
