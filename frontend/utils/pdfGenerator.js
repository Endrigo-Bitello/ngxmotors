import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateFinanciamentoPDF = (financiamento, veiculo) => {
    const doc = new jsPDF();

    // Função para formatar valores em BRL
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
    };

    // Função para calcular a porcentagem da entrada
    const calculateEntryPercentage = (entrada, valorVenda) => {
        return ((entrada / valorVenda) * 100).toFixed(2);
    };

    // Configurações básicas
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    // Adiciona a logo da empresa de forma discreta
    const logoUrl = '/logo.png'; 
    doc.addImage(logoUrl, 'PNG', margin, 10, 30, 10); // Logo menor e mais clean

    // Título do documento
    doc.setFontSize(20);
    doc.setTextColor(33);
    doc.setFont('helvetica', 'bold');
    doc.text('Simulação de Financiamento', pageWidth / 2, 28, { align: 'center' });

    // Subtítulo e data
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.setFont('helvetica', 'normal');
    doc.text('Detalhes da simulação de financiamento', pageWidth / 2, 36, { align: 'center' });
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, 45);
    doc.text(`Cód.: ${veiculo.customId}`, pageWidth - margin, 45, { align: 'right' });

    // Seção de informações do cliente
    doc.setFontSize(14);
    doc.setTextColor(33);
    doc.setFont('helvetica', 'bold');
    doc.text('Informações do Cliente', margin, 55);
    doc.setLineWidth(0.4);
    doc.line(margin, 57, pageWidth - margin, 57);

    doc.autoTable({
        startY: 60,
        margin: { left: margin, right: margin },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: 33,
            fontStyle: 'bold',
        },
        bodyStyles: {
            textColor: 50,
        },
        head: [['Nome', 'Email', 'Telefone', 'CPF']],
        body: [
            [financiamento.nome, financiamento.email, financiamento.telefone, financiamento.cpf],
        ],
        theme: 'plain', // Estilo clean sem bordas visíveis
    });

    // Seção de informações do veículo
    let currentY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(33);
    doc.setFont('helvetica', 'bold');
    doc.text('Informações do Veículo', margin, currentY);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 5;

    if (veiculo) {
        doc.autoTable({
            startY: currentY,
            margin: { left: margin, right: margin },
            headStyles: {
                fillColor: [245, 245, 245],
                textColor: 33,
                fontStyle: 'bold',
            },
            bodyStyles: {
                textColor: 50,
            },
            head: [['Marca', 'Modelo', 'Ano', 'Combustível', 'Transmissão', 'Valor de Venda']],
            body: [
                [
                    veiculo.marca,
                    veiculo.modelo,
                    veiculo.anoFabricacao,
                    veiculo.combustivel,
                    veiculo.transmissao,
                    formatCurrency(veiculo.valorVenda),
                ],
            ],
            theme: 'plain', // Remove bordas para um estilo mais clean
        });
    } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Informações do veículo não disponíveis', margin, currentY + 10);
    }

    // Seção de informações da simulação
    currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : currentY + 20;
    doc.setFontSize(14);
    doc.setTextColor(33);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes da Simulação', margin, currentY);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 5;
    doc.autoTable({
        startY: currentY,
        margin: { left: margin, right: margin },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: 33,
            fontStyle: 'bold',
        },
        bodyStyles: {
            textColor: 50,
        },
        head: [['Entrada', 'Parcelas', 'Valor da Parcela Estimada', 'Valor Financiado', '% Entrada']],
        body: [
            [
                formatCurrency(financiamento.entrada),
                `${financiamento.parcelas}x`,
                formatCurrency(financiamento.parcelaEstimada),
                formatCurrency(veiculo.valorVenda - financiamento.entrada),
                `${calculateEntryPercentage(financiamento.entrada, veiculo.valorVenda)}%`,
            ],
        ],
        theme: 'plain',
    });

    // Rodapé com informações adicionais
    currentY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    doc.text('Este documento é apenas uma simulação e não possui validade legal.', margin, currentY);

    // Número da página no rodapé
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Página 1 de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Salva o documento PDF
    doc.save(`Simulacao_Financiamento_${financiamento.nome}.pdf`);
};
