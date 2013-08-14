path = require 'path'
fs = require 'fs'

# resolve the given id relatively to the current filepath
# ------------------------------------------------------------------------------
resolve = module.exports = (dirpath, filepath, id)->
  
  # removes js extension to normalize id
  id = id.replace /\.js$/m, ''

  # try to resolve its real path
  file = resolve_id filepath, id

  # return normalized path if file is found
  return (path.resolve file) if file?

  # otherwise show error
  caller = path.relative dirpath, filepath
  console.log "Cannot find module '#{id}' for '#{caller}'"
  return null


# Resolves the required id/path
# ------------------------------------------------------------------------------
resolve_id = (filepath, id)->

  # for globals, always go on for module
  if id[0] isnt '.'
    # console.log '+ (module-0)'
    return resolve_module filepath, id

  # breaks id path nodes (if there's some)
  segs = [].concat (id.split '/')

  # filter dirname from filepath, to start the search
  idpath = path.dirname filepath

  # loop them mounting the full path relatively to current
  while segs.length
    seg = do segs.shift
    idpath = path.resolve idpath, seg

  # file.js
  return file if (file = resolve_file idpath)

  # module
  return file if (file = resolve_module filepath, id)

  # dir/index.js
  return file if (file = resolve_index filepath, idpath)


# tries to get the file by its name
# ------------------------------------------------------------------------------
resolve_file = ( filepath )->
  filepath += '.js' if (path.extname filepath) is ''
  return filepath if fs.existsSync filepath
  return null


# tries to get the index file inside a directory
# ------------------------------------------------------------------------------
resolve_index = ( dirpath )->
  filepath = path.join dirpath, 'index.js'
  return filepath if fs.existsSync filepath
  return null


# ------------------------------------------------------------------------------
resolve_module = (filepath, id)->
  # console.log '[resolve_module]', filepath, id
  nmods = closest_node_modules filepath

  # trying to reach the `main` entry in package.json (if there's one)
  json = path.join nmods, id, 'package.json'
  if (fs.existsSync json)

    # tries to get the main entry in package.json
    main = (require json).main
    if main?

      # trying to get it as is
      main = path.join (path.dirname json), main
      if (file = resolve_file main)?
        return file 

      # or as a folder with an index file inside
      dir = path.join (path.dirname json), dir
      return file if (file = resolve_dir main)?

    # if there's no main entry, tries to get the index file
    return file if (file = resolve_dir file)?


# searches for the closest node_modules folder in the parent dirs
# ------------------------------------------------------------------------------
closest_node_modules = (filepath)->
  if (path.extname filepath) isnt '' 
    if not fs.lstatSync(filepath).isDirectory()
      tmp = path.dirname filepath
  else
    tmp = filepath

  while tmp isnt '/'
    nmods = path.join tmp, 'node_modules'
    if fs.existsSync nmods
      return nmods
    else
      tmp = path.join tmp, '..'

  return null