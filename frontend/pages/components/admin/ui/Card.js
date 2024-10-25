// components/ui/Card.js
export const Card = ({ children }) => {
  return <div className="bg-white shadow-md rounded-lg p-4">{children}</div>;
};

export const CardHeader = ({ children }) => {
  return <div className="border-b border-gray-200 pb-4 mb-4">{children}</div>;
};

export const CardTitle = ({ children }) => {
  return <h2 className="text-xl font-bold text-gray-800">{children}</h2>;
};

export const CardDescription = ({ children }) => {
  return <p className="text-sm text-gray-600">{children}</p>;
};

export const CardContent = ({ children }) => {
  return <div>{children}</div>;
};

export const CardFooter = ({ children }) => {
  return <div className="border-t border-gray-200 pt-4 mt-4">{children}</div>;
};

// Adiciona uma exportação padrão
export default {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
