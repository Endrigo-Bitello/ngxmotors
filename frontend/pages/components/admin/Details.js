import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaCarSide,
    FaClipboardList,
    FaCloudUploadAlt,
    FaFileAlt,
    FaImages,
    FaInfoCircle,
    FaPencilAlt,
    FaTimes,
} from 'react-icons/fa';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import Stock from './Stock';

export default function Details({ vehicle, onClose, onSave }) {
    const [editableVehicle, setEditableVehicle] = useState(vehicle || {
        marca: '',
        modelo: '',
        tipoDeCarro: '',
        anoFabricacao: '',
        anoModelo: '',
        transmissao: '',
        cor: '',
    });

    const carBrands = [
        'Fiat', 'Chevrolet', 'Volkswagen', 'Toyota', 'Hyundai', 'Jeep', 'Renault',
        'Honda', 'Nissan', 'Ford', 'Dodge', 'Peugeot', 'Citroën', 'Mitsubishi', 'Kia',
        'BMW', 'RAM', 'Mercedes-Benz', 'Mini', 'Audi', 'Volvo', 'Land Rover', 'Suzuki', 'Subaru',
        'Lexus', 'Porsche', 'Jaguar', 'Caoa Chery', 'BYD', 'Troller', 'Ferrari',
        'Lamborghini', 'Bentley'
    ];

    const motoBrands = [
        'Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'Harley-Davidson', 'Triumph',
        'KTM', 'Royal Enfield', 'Haojue', 'Dafra', 'Shineray', 'MV Agusta'
    ];

    const carTypes = [
        'Sedan', 'Hatchback', 'SUV', 'CUV', 'Coupé', 'Conversível', 'Picape',
        'Minivan', 'Esportivo', 'Roadster', 'Buggy'
    ];

    const motoTypes = [
        'Street', 'Esportiva', 'Naked', 'Custom', 'Trail', 'Big Trail', 'Touring',
        'Scooter', 'Crossover', 'Motocross', 'Enduro'
    ];

    const carCombustiveis = [
        'Gasolina', 'Etanol', 'Álcool', 'Flex', 'Diesel', 'Biodiesel', 'Elétrico', 'Híbrido'
    ];

    const motoCombustiveis = [
        'Gasolina', 'Etanol', 'Flex', 'Elétrico'
    ];

    const carDirecoes = [
        'Hidráulica', 'Elétrica', 'Mecânica', 'Eletro-hidráulica'
    ];

    const motoDirecoes = [
        'Convencional', 'Assistida'
    ];

    const carFreios = [
        'Freios a disco', 'Freios ABS'
    ];

    const motoFreios = [
        'Freios a disco', 'ABS', 'CBS'
    ];

    const carTracoes = [
        'Dianteira', 'Traseira', '4x4', 'AWD'
    ];

    const carMotores = [
        '1.0', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0 - 2.9', '3.0 - 3.9', '4.0 ou mais'
    ];

    const carTransmissions = ['Manual', 'Automático', 'Automatizado', 'CVT', 'Dual Clutch'];
    const motoTransmissions = ['Manual', 'Automático', 'CVT'];

    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStock, setShowStock] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Se o campo for "anoFabricacao" ou "anoModelo", permitir apenas números e limitar a 4 dígitos
        if (name === 'anoFabricacao' || name === 'anoModelo') {
            const numericValue = value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
            if (numericValue.length <= 4) {
                setEditableVehicle({ ...editableVehicle, [name]: numericValue });
            }
        } else {
            setEditableVehicle({ ...editableVehicle, [name]: value });
        }
    };

    const handleSave = async () => {
        try {
            const route = vehicle.tipo === 'carro' ? 'carros' : 'motos';

            const vehicleImages = editableVehicle.imagens;

            // Filtra valores undefined antes de mapear
            const imageUploads = await Promise.all(vehicleImages.filter(Boolean).map(async (image) => {
                if (image instanceof File) {
                    const imageData = new FormData();
                    imageData.append('image', image);

                    // Enviando rota de upload para carros
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/${route}/update-images/${editableVehicle.customId}`,
                        imageData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                    );

                    if (typeof response.data.imageURL === 'string') {
                        return response.data.imageURL;
                    } else {
                        console.error('Erro: imageURL não é uma string', response.data.imageURL);
                        return null; // Ou algum valor padrão
                    }
                }

                if (typeof image === 'string') {
                    return image; // Retorna a URL da imagem se não for um File
                } else {
                    console.error('Erro: imagem não é um tipo esperado', image);
                    return null; // Ou algum valor padrão
                }
            }));

            // Filtra as imagens para remover valores nulos
            editableVehicle.imagens = imageUploads.filter(img => img !== null);

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${route}/${editableVehicle.customId}`,
                editableVehicle
            );

            // Enviando rota de deletar imagens não existentes
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/${route}/delete-image/${editableVehicle.customId}`);

            // Notifica o Stock.js que os veículos foram atualizados
            if (onSave) {
                onSave();  // Chama a função que recarrega os veículos
                onClose();
            }

            setIsEditing(false);  // Fecha o modo de edição
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
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Select de Marca */}
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Marca</label>
                                    {isEditing ? (
                                        <select
                                            name="marca"
                                            value={editableVehicle.marca || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        >
                                            {(editableVehicle?.customId?.startsWith('c') ? carBrands : motoBrands).map((brand) => (
                                                <option key={brand} value={brand}>
                                                    {brand}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-base text-gray-700">{editableVehicle.marca || '—'}</p>
                                    )}
                                </div>


                                {/* Informações básicas do veículo */}
                                {[
                                    { key: 'modelo', label: 'Modelo' },
                                    { key: 'anoFabricacao', label: 'Ano de Fabricação' },
                                    { key: 'anoModelo', label: 'Ano do Modelo' },
                                    { key: 'cor', label: 'Cor' },
                                ].map((field) => (
                                    <div key={field.key} className="relative">
                                        {/* Label */}
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>

                                        {/* Input */}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name={field.key}
                                                value={editableVehicle[field.key] || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                            />
                                        ) : (
                                            <p className="text-base text-gray-700">{editableVehicle[field.key] || '—'}</p>
                                        )}
                                    </div>
                                ))}

                                {/* Select de Tipo de Carro ou Tipo de Moto */}
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {editableVehicle?.customId?.startsWith('c') ? 'Tipo de Carro' : 'Tipo de Moto'}
                                    </label>

                                    {isEditing ? (
                                        <select
                                            name={editableVehicle?.customId?.startsWith('c') ? 'tipoDeCarro' : 'tipoDeMoto'}
                                            value={
                                                editableVehicle[editableVehicle?.customId?.startsWith('c') ? 'tipoDeCarro' : 'tipoDeMoto'] || ''
                                            }
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        >
                                            {(editableVehicle?.customId?.startsWith('c') ? carTypes : motoTypes).map(
                                                (type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    ) : (
                                        <p className="text-base text-gray-700">
                                            {editableVehicle[editableVehicle?.customId?.startsWith('c') ? 'tipoDeCarro' : 'tipoDeMoto'] || '—'}
                                        </p>
                                    )}
                                </div>

                                {/* Select de Transmissão */}
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Transmissão</label>
                                    {isEditing ? (
                                        <select
                                            name="transmissao"
                                            value={editableVehicle.transmissao || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        >
                                            {(editableVehicle?.customId?.startsWith('c') ? carTransmissions : motoTransmissions).map(
                                                (trans) => (
                                                    <option key={trans} value={trans}>
                                                        {trans}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    ) : (
                                        <p className="text-base text-gray-700">{editableVehicle.transmissao || '—'}</p>
                                    )}
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


            case 1: // Ficha Técnica
                return (
                    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Ficha Técnica</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Campos comuns a ambos os tipos de veículos */}
                                {[
                                    { key: 'quilometragem', label: 'Quilometragem', suffix: 'km' },
                                    { key: 'combustivel', label: 'Combustível' },
                                    { key: 'direcao', label: 'Direção' },
                                    { key: 'potencia', label: 'Potência', suffix: 'CV' },
                                    { key: 'torque', label: 'Torque', suffix: 'kgfm' },
                                    { key: 'freios', label: 'Freios' },
                                ].map((field) => (
                                    <div key={field.key} className="relative">
                                        {/* Campo de Label */}
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                                        {isEditing && field.key === 'combustivel' ? (
                                            <div className="relative">
                                                <select
                                                    name={field.key}
                                                    value={editableVehicle[field.key] || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                >
                                                    {(editableVehicle?.customId?.startsWith('c') ? carCombustiveis : motoCombustiveis).map(
                                                        (brand) => (
                                                            <option key={brand} value={brand}>
                                                                {brand}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        ) : isEditing && field.key === 'direcao' ? (
                                            <div className="relative">
                                                <select
                                                    name={field.key}
                                                    value={editableVehicle[field.key] || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                >
                                                    {(editableVehicle?.customId?.startsWith('c') ? carDirecoes : motoDirecoes).map((brand) => (
                                                        <option key={brand} value={brand}>
                                                            {brand}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : isEditing && field.key === 'freios' ? (
                                            <div className="relative">
                                                <select
                                                    name={field.key}
                                                    value={editableVehicle[field.key] || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                >
                                                    {(editableVehicle?.customId?.startsWith('c') ? carFreios : motoFreios).map((brand) => (
                                                        <option key={brand} value={brand}>
                                                            {brand}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : isEditing ? (
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
                                            editableVehicle[field.key] && (
                                                <div className="flex justify-between items-center">
                                                    <p className="text-base text-gray-700">{editableVehicle[field.key]}</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ))}

                                {/* Condicionais para Moto */}
                                {editableVehicle?.customId?.startsWith('m') && (
                                    <>
                                        {/* Troca "Motor" por "Cilindrada" para motos */}
                                        <div className="relative">
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">Cilindradas</label>
                                            {isEditing ? (
                                                <select
                                                    name="cilindrada"
                                                    value={editableVehicle.cilindrada || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                >
                                                    {[
                                                        '50', '100', '110', '125', '150', '155', '160', '190', '200',
                                                        '250', '300', '350', '400', '420', '450', '500', '550', '600',
                                                        '650', '700', '750', '800', '850', '900', '950', '1000',
                                                        'Acima de 1.000'
                                                    ].map((cilindrada) => (
                                                        <option key={cilindrada} value={cilindrada}>
                                                            {cilindrada}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                editableVehicle.cilindrada && (
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-base text-gray-700">{editableVehicle.cilindrada}</p>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Troca "Número de Portas" por "Número de Marchas" para motos */}
                                        <div className="relative">
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">Número de Marchas</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="numeroDeMarchas"
                                                    value={editableVehicle.numeroDeMarchas}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                />
                                            ) : (
                                                editableVehicle.numeroDeMarchas && (
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-base text-gray-700">{editableVehicle.numeroDeMarchas}</p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Condicionais para Carro */}
                                {editableVehicle?.customId?.startsWith('c') && (
                                    <>
                                        {/* Campo de Trações para carros */}
                                        <div className="relative">
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">Tração</label>
                                            {isEditing ? (
                                                <select
                                                    type="text"
                                                    name="tracao"
                                                    value={editableVehicle.tracao}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                >
                                                    {(carTracoes).map((brand) => (
                                                        <option key={brand} value={brand}>
                                                            {brand}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                editableVehicle.tracao && (
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-base text-gray-700">{editableVehicle.tracao}</p>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Campo de Motor para carros */}
                                        <div className="relative">
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">Motor</label>
                                            {isEditing ? (
                                                <select
                                                    type="text"
                                                    name="motor"
                                                    value={editableVehicle.motor}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                >
                                                    {(carMotores).map((brand) => (
                                                        <option key={brand} value={brand}>
                                                            {brand}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                editableVehicle.motor && (
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-base text-gray-700">{editableVehicle.motor}</p>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Campo de Capacidade do Porta Malas para carros */}
                                        <div className="relative">
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">Capacidade do Porta Malas (L)</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="capacidadePortaMalas"
                                                    value={editableVehicle.capacidadePortaMalas}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                                />
                                            ) : (
                                                editableVehicle.capacidadePortaMalas && (
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-base text-gray-700">{editableVehicle.capacidadePortaMalas} L</p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </>
                                )}
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
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="space-y-6">
                                {[
                                    { key: 'placa', label: 'Placa' },
                                    { key: 'chassi', label: 'Chassi', maxLength: 17 },
                                    { key: 'renavam', label: 'RENAVAM', maxLength: 11 },
                                    { key: 'crlv', label: 'CRLV', maxLength: 11 },
                                ].map((field) => (
                                    <div key={field.key} className="relative">
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name={field.key}
                                                value={editableVehicle[field.key]}
                                                onChange={handleInputChange}
                                                maxLength={field.maxLength || undefined}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                            />
                                        ) : (
                                            editableVehicle[field.key] && (
                                                <p className="text-base text-gray-700">{editableVehicle[field.key]}</p>
                                            )
                                        )}
                                    </div>
                                ))}

                                {/* Dropdown para IPVA */}
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">IPVA</label>
                                    {isEditing ? (
                                        <select
                                            name="ipva"
                                            value={editableVehicle.ipva || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        >
                                            <option value="Pago">Pago</option>
                                            <option value="Pendente">Pendente</option>
                                        </select>
                                    ) : (
                                        editableVehicle.ipva && (
                                            <p className="text-base text-gray-700">{editableVehicle.ipva}</p>
                                        )
                                    )}
                                </div>

                                {/* Dropdown para DPVAT */}
                                <div className="relative">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">DPVAT</label>
                                    {isEditing ? (
                                        <select
                                            name="dpvat"
                                            value={editableVehicle.dpvat || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        >
                                            <option value="Pago">Pago</option>
                                            <option value="Pendente">Pendente</option>
                                        </select>
                                    ) : (
                                        editableVehicle.dpvat && (
                                            <p className="text-base text-gray-700">{editableVehicle.dpvat}</p>
                                        )
                                    )}
                                </div>

                                {/* Campos de Checkbox */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            {/* Botões de Ações Globais */}
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
                const isCar = editableVehicle?.customId?.startsWith('c');
                const isMoto = editableVehicle?.customId?.startsWith('m');

                // Opcionais para carros
                const opcionaisCarro = [
                    { key: 'tetoSolar', label: 'Teto Solar' },
                    { key: 'pilotoAutomatico', label: 'Piloto Automático' },
                    { key: 'bancosCouro', label: 'Bancos de Couro' },
                    { key: 'cameraRe', label: 'Câmera de Ré' },
                    { key: 'kitGNV', label: 'Kit GNV' },
                    { key: 'sensorEstacionamento', label: 'Sensor de Estacionamento' },
                    { key: 'chavePresencial', label: 'Chave Presencial' },
                    { key: 'sistemaNavegacao', label: 'Sistema de Navegação' },
                    { key: 'centralMultimidia', label: 'Central Multimídia' },
                    { key: 'controleTracao', label: 'Controle de Tração' },
                    { key: 'assistenteRampa', label: 'Assistente de Rampa' },
                    { key: 'rodasLigaLeve', label: 'Rodas de Liga Leve' },
                    { key: 'faroisNeblina', label: 'Faróis de Neblina' },
                    { key: 'assistenteEstacionamento', label: 'Assistente de Estacionamento' },
                    { key: 'freioEstacionamentoEletrico', label: 'Freio de Estacionamento Elétrico' },
                    { key: 'airbag', label: 'Airbag' },
                    { key: 'arCondicionado', label: 'Ar Condicionado' },
                    { key: 'alarme', label: 'Alarme' },
                    { key: 'blindado', label: 'Blindado' },
                    { key: 'computadorBordo', label: 'Computador de Bordo' },
                    { key: 'conexaoUSB', label: 'Conexão USB' },
                    { key: 'bluetooth', label: 'Bluetooth' },
                    { key: 'som', label: 'Sistema de Som' },
                    { key: 'tracao4x4', label: 'Tração 4x4' },
                    { key: 'travaEletrica', label: 'Trava Elétrica' },
                    { key: 'vidroEletrico', label: 'Vidro Elétrico' },
                    { key: 'volanteMultifuncional', label: 'Volante Multifuncional' },
                ];

                // Opcionais para motos
                const opcionaisMoto = [
                    { key: 'freiosABS', label: 'Freios ABS' },
                    { key: 'controleTracao', label: 'Controle de Tração' },
                    { key: 'controleEstabilidade', label: 'Controle de Estabilidade' },
                    { key: 'computadorBordo', label: 'Computador de Bordo' },
                    { key: 'cameraRe', label: 'Câmera de Ré' },
                    { key: 'conexaoUSB', label: 'Conexão USB' },
                    { key: 'sistemaNavegacao', label: 'Sistema de Navegação' },
                    { key: 'faroisLED', label: 'Faróis de LED' },
                    { key: 'manoplasAquecidas', label: 'Manoplas Aquecidas' },
                    { key: 'alarme', label: 'Alarme' },
                    { key: 'protetorMotor', label: 'Protetor de Motor' },
                    { key: 'bolhaAerodinamica', label: 'Bolha Aerodinâmica' },
                    { key: 'malasLaterais', label: 'Malas Laterais' },
                    { key: 'bancoAquecido', label: 'Banco Aquecido' },
                    { key: 'suspensaoAjustavel', label: 'Suspensão Ajustável' },
                ];

                // Escolhe os opcionais corretos para o tipo de veículo
                const opcionais = isCar ? opcionaisCarro : opcionaisMoto;

                return (
                    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Opcionais do Veículo</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {opcionais.map((opcional) => (
                                    <div key={opcional.key} className="flex items-center space-x-3">
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
                                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
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
                                            value={
                                                editableVehicle.valorCompra !== ''
                                                    ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(
                                                        editableVehicle.valorCompra
                                                    )
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                const numericValue = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                                                setEditableVehicle({
                                                    ...editableVehicle,
                                                    valorCompra: isNaN(numericValue) ? '' : numericValue.toFixed(2),
                                                });
                                            }}
                                            placeholder="0,00"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        />
                                    ) : (
                                        <p className="pl-10 py-2 text-gray-700">
                                            {parseFloat(editableVehicle.valorCompra || 0).toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                            })}
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
                                            value={
                                                editableVehicle.valorVenda !== ''
                                                    ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(
                                                        editableVehicle.valorVenda
                                                    )
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                const numericValue = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                                                setEditableVehicle({
                                                    ...editableVehicle,
                                                    valorVenda: isNaN(numericValue) ? '' : numericValue.toFixed(2),
                                                });
                                            }}
                                            placeholder="0,00"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        />
                                    ) : (
                                        <p className="pl-10 py-2 text-gray-700">
                                            {parseFloat(editableVehicle.valorVenda || 0).toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                            })}
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
                                            value={
                                                editableVehicle.valorFIPE !== ''
                                                    ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(
                                                        editableVehicle.valorFIPE
                                                    )
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                const numericValue = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                                                setEditableVehicle({
                                                    ...editableVehicle,
                                                    valorFIPE: isNaN(numericValue) ? '' : numericValue.toFixed(2),
                                                });
                                            }}
                                            placeholder="0,00"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                                        />
                                    ) : (
                                        <p className="pl-10 py-2 text-gray-700">
                                            {parseFloat(editableVehicle.valorFIPE || 0).toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                            })}
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
                                        setEditableVehicle({
                                            ...editableVehicle,
                                            imagens: [...editableVehicle.imagens, ...files],
                                        });
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
                                                Arraste e solte as imagens aqui ou{' '}
                                                <span className="text-blue-600 underline">clique para selecionar</span>
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
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                                                            setEditableVehicle({
                                                                ...editableVehicle,
                                                                imagens: updatedImages,
                                                            });
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                                                    >
                                                        <FaTimes className="h-4 w-4" />
                                                    </button>
                                                )}
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
                    <nav className="flex overflow-x-auto no-scrollbar space-x-4 md:space-x-0 md:flex-wrap justify-between" aria-label="Tabs">
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
                                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-300 whitespace-nowrap ${activeTab === index
                                    ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span
                                    className={`text-lg transition-transform duration-300 ${activeTab === index ? 'scale-110' : 'scale-100'
                                        }`}
                                >
                                    {tab.icon}
                                </span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>


                {/* Seção de Conteúdo */}
                <div className="mt-6">
                    {renderSection()}
                </div>
            </div>
        </div>
    );
}

