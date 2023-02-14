# Be sure to restart your server when you modify this file.

# Version of your manage, change this if you want to expire all your manage.
Rails.application.config.assets.version = '1.0'

# Add additional manage to the asset load path.
# Rails.application.config.manage.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')

# Precompile additional manage.
# application.js, application.css, and all non-JS/CSS in the app/manage
# folder are already added.
# Rails.application.config.manage.precompile += %w( manage.js manage.scss )
