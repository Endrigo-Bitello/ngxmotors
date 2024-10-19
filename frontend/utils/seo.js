export const setSEO = ({ title, metaDescription, icon }) => {
    // Definir título
    if (title) {
      document.title = title;
    }
  
    // Atualizar meta título (opcional)
    const metaTitleTag = document.querySelector('meta[name="title"]');
    if (title && metaTitleTag) {
      metaTitleTag.setAttribute('content', title);
    } else if (title) {
      const newMetaTitleTag = document.createElement('meta');
      newMetaTitleTag.name = 'title';
      newMetaTitleTag.content = title;
      document.head.appendChild(newMetaTitleTag);
    }
  
    // Atualizar meta descrição (opcional)
    if (metaDescription) {
      const metaDescriptionTag = document.querySelector('meta[name="description"]');
      if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', metaDescription);
      } else {
        const newMetaDescriptionTag = document.createElement('meta');
        newMetaDescriptionTag.name = 'description';
        newMetaDescriptionTag.content = metaDescription;
        document.head.appendChild(newMetaDescriptionTag);
      }
    }
  
    // Atualizar ícone (opcional)
    if (icon) {
      const linkIcon = document.querySelector('link[rel="icon"]');
      if (linkIcon) {
        linkIcon.href = icon;
      } else {
        const newIconLink = document.createElement('link');
        newIconLink.rel = 'icon';
        newIconLink.href = icon;
        document.head.appendChild(newIconLink);
      }
    }
  };
  