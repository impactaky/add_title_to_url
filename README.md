# add_title_to_url

Plugin for adding Title to URL

## Requirements

[vim-denops/denops.vim](https://github.com/vim-denops/denops.vim)

## Setup example

Setup example for dein.toml

```toml
[[plugins]]
repo = 'impactaky/add_title_to_url'
lazy = 1
hook_add = '''
    vmap 'm :'<,'>AddTitleToUrl<CR>
'''
