import PptxGenJS from 'pptxgen-js';

export const generatePowerPoint = (slides, title = 'Presentation') => {
  const prs = new PptxGenJS();

  prs.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
  prs.defineLayout({ name: 'LAYOUT2', width: 10, height: 7.5 });

  const titleSlide = prs.addSlide();
  titleSlide.background = { color: '2C5530' };
  titleSlide.addText(title, {
    x: 0.5,
    y: 3,
    w: 9,
    h: 1.5,
    fontSize: 54,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
  });

  slides.forEach((slide) => {
    const contentSlide = prs.addSlide();
    contentSlide.background = { color: 'FFFFFF' };

    contentSlide.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.8,
      fontSize: 32,
      bold: true,
      color: '2C5530',
    });

    if (slide.content) {
      contentSlide.addText(slide.content, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 5.5,
        fontSize: 14,
        color: '333333',
      });
    }

    if (slide.image) {
      contentSlide.addImage({
        path: slide.image,
        x: 6,
        y: 1.5,
        w: 3,
        h: 5.5,
      });
    }
  });

  return prs;
};

export const downloadPresentation = (prs, filename = 'presentation.pptx') => {
  prs.writeFile({ fileName: filename });
};
