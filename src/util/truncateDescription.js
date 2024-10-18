

export const truncateDescription = (description) => {
    description = description || "";
    if(description.length < 125) {
      return description
    } else {
      description = description.slice(0, 123);
      description += '...';
      return description
    }
  };
