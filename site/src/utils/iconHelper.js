export const getIcon = (extension, dir) => {
    const available = ['AVI', 'AI', 'DOC', 'GIF', 'JPG', 'MKV', 'MP3', 'PDF', 'PPT', 'PSD', 'SVG', 'TXT', 'XLS', 'ZIP'];
    const ext = extension.replaceAll('.', '').toUpperCase();
    if(dir)
    {
        return 'icon/folder.png'
    }
    else
    {
        if(available.includes(ext))
        {
            return 'icon/' + ext + '.png'
        }
        else if(ext.includes("DOC"))
        {
            return 'icon/DOC.png'
        }
        else
        {
            return 'icon/TXT.png'
        }
    }
}