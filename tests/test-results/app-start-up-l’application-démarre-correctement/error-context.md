# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app/start-up.spec.js >> l’application démarre correctement
- Location: specs/e2e/app/start-up.spec.js:9:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#main-panel')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#main-panel')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - img "application error" [ref=e4]
    - generic [ref=e5]:
      - heading "NameError at /" [level=1] [ref=e6]:
        - strong [ref=e7]: NameError
        - text: at
        - strong [ref=e8]: /
      - heading "undefined local variable or method 'null' for class Item" [level=2] [ref=e9]
      - list [ref=e10]:
        - listitem [ref=e11]:
          - strong [ref=e12]: "file:"
          - code [ref=e13]: item.rb
        - listitem [ref=e14]:
          - strong [ref=e15]: "location:"
          - code [ref=e16]: nil
        - listitem [ref=e17]:
          - strong [ref=e18]: "line:"
          - text: "18"
  - generic [ref=e19]:
    - heading "BACKTRACE" [level=3] [ref=e20]
    - paragraph:
      - link "(expand)" [ref=e21] [cursor=pointer]:
        - /url: "#"
    - paragraph [ref=e22]:
      - strong [ref=e23]: "JUMP TO:"
      - link "GET" [ref=e24] [cursor=pointer]:
        - /url: "#get-info"
      - link "POST" [ref=e25] [cursor=pointer]:
        - /url: "#post-info"
      - link "COOKIES" [ref=e26] [cursor=pointer]:
        - /url: "#cookie-info"
      - link "ENV" [ref=e27] [cursor=pointer]:
        - /url: "#env-info"
    - list [ref=e28]:
      - listitem [ref=e29]:
        - code [ref=e30]: /Users/philippeperret/Programmes/Eventer3/lib/models/item.rb
        - text: in
        - code [ref=e31]:
          - strong [ref=e32]: nil
      - listitem [ref=e33]:
        - list [ref=e34]:
          - listitem [ref=e35]:
            - code [ref=e36]: "co: nil,"
      - listitem [ref=e37]:
        - code [ref=e38]: /Users/philippeperret/Programmes/Eventer3/lib/models/item.rb
        - text: in
        - code [ref=e39]:
          - strong [ref=e40]: nil
      - listitem [ref=e41]:
        - list [ref=e42]:
          - listitem [ref=e43]:
            - code [ref=e44]: "[minimal_data('modele')]"
      - listitem [ref=e45]:
        - code [ref=e46]: /Users/philippeperret/Programmes/Eventer3/lib/models/projects.rb
        - text: in
        - code [ref=e47]:
          - strong [ref=e48]: nil
      - listitem [ref=e49]:
        - list [ref=e50]:
          - listitem [ref=e51]:
            - code [ref=e52]: save_items(Item.minimal_data_items)
      - listitem [ref=e53]:
        - code [ref=e54]: /Users/philippeperret/Programmes/Eventer3/lib/models/Lister.rb
        - text: in
        - code [ref=e55]:
          - strong [ref=e56]: nil
      - listitem [ref=e57]:
        - list [ref=e58]:
          - listitem [ref=e59]:
            - code [ref=e60]: lister.create_minimal_items
      - listitem [ref=e61]:
        - code [ref=e62]: /Users/philippeperret/Programmes/Eventer3/lib/bootstrap.rb
        - text: in
        - code [ref=e63]:
          - strong [ref=e64]: nil
      - listitem [ref=e65]:
        - list [ref=e66]:
          - listitem [ref=e67]:
            - code [ref=e68]: Projects.create_minimal_data
      - listitem [ref=e69]:
        - code [ref=e70]: ./app.rb
        - text: in
        - code [ref=e71]:
          - strong [ref=e72]: nil
      - listitem [ref=e73]:
        - list [ref=e74]:
          - listitem [ref=e75]:
            - code [ref=e76]: Bootstrap.ensure_initial_data!(DATA_DIR)
  - generic [ref=e77]:
    - heading "GET" [level=3] [ref=e78]
    - paragraph [ref=e79]: No GET data.
  - generic [ref=e80]:
    - heading "POST" [level=3] [ref=e81]
    - paragraph [ref=e82]: No POST data.
  - generic [ref=e83]:
    - heading "COOKIES" [level=3] [ref=e84]
    - paragraph [ref=e85]: No cookie data.
  - generic [ref=e86]:
    - heading "Rack ENV" [level=3] [ref=e87]
    - table [ref=e88]:
      - rowgroup [ref=e89]:
        - row "Variable Value" [ref=e90]:
          - columnheader "Variable" [ref=e91]
          - columnheader "Value" [ref=e92]
        - row "GATEWAY_INTERFACE CGI/1.2" [ref=e93]:
          - cell "GATEWAY_INTERFACE" [ref=e94]
          - cell "CGI/1.2" [ref=e95]:
            - generic [ref=e96]: CGI/1.2
        - row "HTTP_ACCEPT text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" [ref=e97]:
          - cell "HTTP_ACCEPT" [ref=e98]
          - cell "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" [ref=e99]:
            - generic [ref=e100]: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
        - row "HTTP_ACCEPT_ENCODING gzip, deflate, br, zstd" [ref=e101]:
          - cell "HTTP_ACCEPT_ENCODING" [ref=e102]
          - cell "gzip, deflate, br, zstd" [ref=e103]:
            - generic [ref=e104]: gzip, deflate, br, zstd
        - row "HTTP_ACCEPT_LANGUAGE en-US" [ref=e105]:
          - cell "HTTP_ACCEPT_LANGUAGE" [ref=e106]
          - cell "en-US" [ref=e107]:
            - generic [ref=e108]: en-US
        - row "HTTP_CONNECTION keep-alive" [ref=e109]:
          - cell "HTTP_CONNECTION" [ref=e110]
          - cell "keep-alive" [ref=e111]:
            - generic [ref=e112]: keep-alive
        - row "HTTP_HOST 127.0.0.1:4567" [ref=e113]:
          - cell "HTTP_HOST" [ref=e114]
          - cell "127.0.0.1:4567" [ref=e115]:
            - generic [ref=e116]: 127.0.0.1:4567
        - row "HTTP_SEC_CH_UA \"Chromium\";v=\"148\", \"HeadlessChrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"" [ref=e117]:
          - cell "HTTP_SEC_CH_UA" [ref=e118]
          - cell "\"Chromium\";v=\"148\", \"HeadlessChrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"" [ref=e119]:
            - generic [ref=e120]: "\"Chromium\";v=\"148\", \"HeadlessChrome\";v=\"148\", \"Not/A)Brand\";v=\"99\""
        - row "HTTP_SEC_CH_UA_MOBILE ?0" [ref=e121]:
          - cell "HTTP_SEC_CH_UA_MOBILE" [ref=e122]
          - cell "?0" [ref=e123]:
            - generic [ref=e124]: "?0"
        - row "HTTP_SEC_CH_UA_PLATFORM \"macOS\"" [ref=e125]:
          - cell "HTTP_SEC_CH_UA_PLATFORM" [ref=e126]
          - cell "\"macOS\"" [ref=e127]:
            - generic [ref=e128]: "\"macOS\""
        - row "HTTP_SEC_FETCH_DEST document" [ref=e129]:
          - cell "HTTP_SEC_FETCH_DEST" [ref=e130]
          - cell "document" [ref=e131]:
            - generic [ref=e132]: document
        - row "HTTP_SEC_FETCH_MODE navigate" [ref=e133]:
          - cell "HTTP_SEC_FETCH_MODE" [ref=e134]
          - cell "navigate" [ref=e135]:
            - generic [ref=e136]: navigate
        - row "HTTP_SEC_FETCH_SITE none" [ref=e137]:
          - cell "HTTP_SEC_FETCH_SITE" [ref=e138]
          - cell "none" [ref=e139]:
            - generic [ref=e140]: none
        - row "HTTP_SEC_FETCH_USER ?1" [ref=e141]:
          - cell "HTTP_SEC_FETCH_USER" [ref=e142]
          - cell "?1" [ref=e143]:
            - generic [ref=e144]: "?1"
        - row "HTTP_UPGRADE_INSECURE_REQUESTS 1" [ref=e145]:
          - cell "HTTP_UPGRADE_INSECURE_REQUESTS" [ref=e146]
          - cell "1" [ref=e147]:
            - generic [ref=e148]: "1"
        - row "HTTP_USER_AGENT Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/148.0.7778.96 Safari/537.36" [ref=e149]:
          - cell "HTTP_USER_AGENT" [ref=e150]
          - cell "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/148.0.7778.96 Safari/537.36" [ref=e151]:
            - generic [ref=e152]: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/148.0.7778.96 Safari/537.36
        - row "PATH_INFO /" [ref=e153]:
          - cell "PATH_INFO" [ref=e154]
          - cell / [ref=e155]:
            - generic [ref=e156]: /
        - row "QUERY_STRING" [ref=e157]:
          - cell "QUERY_STRING" [ref=e158]
          - cell [ref=e159]
        - row "REMOTE_ADDR 127.0.0.1" [ref=e160]:
          - cell "REMOTE_ADDR" [ref=e161]
          - cell "127.0.0.1" [ref=e162]:
            - generic [ref=e163]: 127.0.0.1
        - row "REQUEST_METHOD GET" [ref=e164]:
          - cell "REQUEST_METHOD" [ref=e165]
          - cell "GET" [ref=e166]:
            - generic [ref=e167]: GET
        - row "REQUEST_PATH /" [ref=e168]:
          - cell "REQUEST_PATH" [ref=e169]
          - cell / [ref=e170]:
            - generic [ref=e171]: /
        - row "REQUEST_URI /" [ref=e172]:
          - cell "REQUEST_URI" [ref=e173]
          - cell / [ref=e174]:
            - generic [ref=e175]: /
        - row "SCRIPT_NAME" [ref=e176]:
          - cell "SCRIPT_NAME" [ref=e177]
          - cell [ref=e178]
        - row "SERVER_NAME 127.0.0.1" [ref=e179]:
          - cell "SERVER_NAME" [ref=e180]
          - cell "127.0.0.1" [ref=e181]:
            - generic [ref=e182]: 127.0.0.1
        - row "SERVER_PORT 4567" [ref=e183]:
          - cell "SERVER_PORT" [ref=e184]
          - cell "4567" [ref=e185]:
            - generic [ref=e186]: "4567"
        - row "SERVER_PROTOCOL HTTP/1.1" [ref=e187]:
          - cell "SERVER_PROTOCOL" [ref=e188]
          - cell "HTTP/1.1" [ref=e189]:
            - generic [ref=e190]: HTTP/1.1
        - row "SERVER_SOFTWARE puma 7.1.0 Neon Witch" [ref=e191]:
          - cell "SERVER_SOFTWARE" [ref=e192]
          - cell "puma 7.1.0 Neon Witch" [ref=e193]:
            - generic [ref=e194]: puma 7.1.0 Neon Witch
        - row [ref=e195]:
          - cell "puma.config" [ref=e196]
          - cell [ref=e197]:
            - generic [ref=e198]: "#<Puma::Configuration:0x0000000124de8f30 @_options=#<Puma::UserFileDefaultOptions:0x0000000124c700e0 @user_options={Port: 4567, Host: \"localhost\", binds: [\"tcp://localhost:4567\"], app: Sinatra::Application, log_writer: #<Puma::LogWriter:0x0000000124c90a70 @formatter=#<Puma::LogWriter::DefaultFormatter:0x0000000124c5df58>, @custom_logger=nil, @stdout=#<IO:<STDOUT>>, @stderr=#<IO:<STDERR>>, @debug=false, @error_logger=#<Puma::ErrorLogger:0x0000000124c5df08 @ioerr=#<IO:<STDERR>>, @debug=false>>, environment: \"development\"}, @file_options={}, @default_options={auto_trim_time: 30, binds: [\"tcp://0.0.0.0:9292\"], fiber_per_request: false, debug: false, enable_keep_alives: true, early_hints: nil, environment: \"development\", first_data_timeout: 30, idle_timeout: nil, io_selector_backend: :auto, log_requests: false, logger: #<IO:<STDOUT>>, max_keep_alive: 999, max_threads: 5, min_threads: 0, mode: :http, mutate_stdout_and_stderr_to_sync_on_write: true, out_of_band: [], persistent_timeout: 65, prune_bundler: false, queue_requests: true, rackup: \"config.ru\", raise_exception_on_sigterm: true, reaping_time: 1, remote_address: :socket, silence_single_worker_warning: false, silence_fork_callback_warning: false, tag: \"Eventer3\", tcp_host: \"0.0.0.0\", tcp_port: 9292, wait_for_less_busy_worker: 0.005, worker_boot_timeout: 60, worker_check_interval: 5, worker_culling_strategy: :youngest, worker_shutdown_timeout: 30, worker_timeout: 60, workers: 0, http_content_length_limit: nil, Verbose: false, Silent: false, events: #<Puma::Events:0x0000000124c70310 @hooks={state: [], after_booted: []}>, preload_app: false}>, @plugins=#<Puma::PluginLoader:0x0000000124c70040 @instances=[]>, @events=#<Puma::Events:0x0000000124c70310 @hooks={state: [], after_booted: []}>, @hooks={}, @user_dsl=#<Puma::DSL:0x0000000124c5fce0 @config=#<Puma::Configuration:0x0000000124de8f30 ...>, @options={Port: 4567, Host: \"localhost\", binds: [\"tcp://localhost:4567\"], app: Sinatra::Application, log_writer: #<Puma::LogWriter:0x0000000124c90a70 @formatter=#<Puma::LogWriter::DefaultFormatter:0x0000000124c5df58>, @custom_logger=nil, @stdout=#<IO:<STDOUT>>, @stderr=#<IO:<STDERR>>, @debug=false, @error_logger=#<Puma::ErrorLogger:0x0000000124c5df08 @ioerr=#<IO:<STDERR>>, @debug=false>>, environment: \"development\"}, @plugins=[]>, @file_dsl=#<Puma::DSL:0x0000000124c5fb00 @config=#<Puma::Configuration:0x0000000124de8f30 ...>, @options={}, @plugins=[]>, @default_dsl=#<Puma::DSL:0x0000000124c5f9c0 @config=#<Puma::Configuration:0x0000000124de8f30 ...>, @options={auto_trim_time: 30, binds: [\"tcp://0.0.0.0:9292\"], fiber_per_request: false, debug: false, enable_keep_alives: true, early_hints: nil, environment: \"development\", first_data_timeout: 30, idle_timeout: nil, io_selector_backend: :auto, log_requests: false, logger: #<IO:<STDOUT>>, max_keep_alive: 999, max_threads: 5, min_threads: 0, mode: :http, mutate_stdout_and_stderr_to_sync_on_write: true, out_of_band: [], persistent_timeout: 65, prune_bundler: false, queue_requests: true, rackup: \"config.ru\", raise_exception_on_sigterm: true, reaping_time: 1, remote_address: :socket, silence_single_worker_warning: false, silence_fork_callback_warning: false, tag: \"Eventer3\", tcp_host: \"0.0.0.0\", tcp_port: 9292, wait_for_less_busy_worker: 0.005, worker_boot_timeout: 60, worker_check_interval: 5, worker_culling_strategy: :youngest, worker_shutdown_timeout: 30, worker_timeout: 60, workers: 0, http_content_length_limit: nil, Verbose: false, Silent: false, events: #<Puma::Events:0x0000000124c70310 @hooks={state: [], after_booted: []}>, preload_app: false}, @plugins=[]>, @puma_bundler_pruned=false, @loaded=true, @clamped=true>"
        - row "puma.request_body_wait 0.001999999862164259" [ref=e199]:
          - cell "puma.request_body_wait" [ref=e200]
          - cell "0.001999999862164259" [ref=e201]:
            - generic [ref=e202]: "0.001999999862164259"
        - 'row "puma.socket #<TCPSocket:fd 14, AF_INET, 127.0.0.1, 4567>" [ref=e203]':
          - cell "puma.socket" [ref=e204]
          - cell "#<TCPSocket:fd 14, AF_INET, 127.0.0.1, 4567>" [ref=e205]:
            - generic [ref=e206]: "#<TCPSocket:fd 14, AF_INET, 127.0.0.1, 4567>"
        - row "rack.after_reply []" [ref=e207]:
          - cell "rack.after_reply" [ref=e208]
          - cell "[]" [ref=e209]:
            - generic [ref=e210]: "[]"
        - 'row "rack.errors #<Object:0x0000000124afa120>" [ref=e211]':
          - cell "rack.errors" [ref=e212]
          - cell "#<Object:0x0000000124afa120>" [ref=e213]:
            - generic [ref=e214]: "#<Object:0x0000000124afa120>"
        - 'row "rack.hijack #<Method: Puma::Client#full_hijack() /Users/philippeperret/.rbenv/versions/3.4.7/lib/ruby/gems/3.4.0/gems/puma-7.1.0/lib/puma/client.rb:136>" [ref=e215]':
          - cell "rack.hijack" [ref=e216]
          - 'cell "#<Method: Puma::Client#full_hijack() /Users/philippeperret/.rbenv/versions/3.4.7/lib/ruby/gems/3.4.0/gems/puma-7.1.0/lib/puma/client.rb:136>" [ref=e217]':
            - generic [ref=e218]: "#<Method: Puma::Client#full_hijack() /Users/philippeperret/.rbenv/versions/3.4.7/lib/ruby/gems/3.4.0/gems/puma-7.1.0/lib/puma/client.rb:136>"
        - row "rack.hijack? true" [ref=e219]:
          - cell "rack.hijack?" [ref=e220]
          - cell "true" [ref=e221]:
            - generic [ref=e222]: "true"
        - 'row "rack.input #<Puma::NullIO:0x0000000124af0260>" [ref=e223]':
          - cell "rack.input" [ref=e224]
          - cell "#<Puma::NullIO:0x0000000124af0260>" [ref=e225]:
            - generic [ref=e226]: "#<Puma::NullIO:0x0000000124af0260>"
        - 'row "rack.logger #<Logger:0x0000000125139068 @level=1, @progname=nil, @default_formatter=#<Logger::Formatter:0x000000012584ccd8 @datetime_format=nil>, @formatter=nil, @logdev=#<Logger::LogDevice:0x00000001258e2da0 @shift_period_suffix=nil, @shift_size=nil, @shift_age=nil, @filename=nil, @dev=#<IO:<STDERR>>, @binmode=false, @reraise_write_errors=[], @skip_header=false, @mon_data=#<Monitor:0x000000012584ccb0>, @mon_data_owner_object_id=3936>, @level_override={}>" [ref=e227]':
          - cell "rack.logger" [ref=e228]
          - 'cell "#<Logger:0x0000000125139068 @level=1, @progname=nil, @default_formatter=#<Logger::Formatter:0x000000012584ccd8 @datetime_format=nil>, @formatter=nil, @logdev=#<Logger::LogDevice:0x00000001258e2da0 @shift_period_suffix=nil, @shift_size=nil, @shift_age=nil, @filename=nil, @dev=#<IO:<STDERR>>, @binmode=false, @reraise_write_errors=[], @skip_header=false, @mon_data=#<Monitor:0x000000012584ccb0>, @mon_data_owner_object_id=3936>, @level_override={}>" [ref=e229]':
            - generic [ref=e230]: "#<Logger:0x0000000125139068 @level=1, @progname=nil, @default_formatter=#<Logger::Formatter:0x000000012584ccd8 @datetime_format=nil>, @formatter=nil, @logdev=#<Logger::LogDevice:0x00000001258e2da0 @shift_period_suffix=nil, @shift_size=nil, @shift_age=nil, @filename=nil, @dev=#<IO:<STDERR>>, @binmode=false, @reraise_write_errors=[], @skip_header=false, @mon_data=#<Monitor:0x000000012584ccb0>, @mon_data_owner_object_id=3936>, @level_override={}>"
        - row "rack.multiprocess false" [ref=e231]:
          - cell "rack.multiprocess" [ref=e232]
          - cell "false" [ref=e233]:
            - generic [ref=e234]: "false"
        - row "rack.multithread true" [ref=e235]:
          - cell "rack.multithread" [ref=e236]
          - cell "true" [ref=e237]:
            - generic [ref=e238]: "true"
        - 'row "rack.request.cookie_hash {}" [ref=e239]':
          - cell "rack.request.cookie_hash" [ref=e240]
          - 'cell "{}" [ref=e241]':
            - generic [ref=e242]: "{}"
        - 'row "rack.request.form_hash {}" [ref=e243]':
          - cell "rack.request.form_hash" [ref=e244]
          - 'cell "{}" [ref=e245]':
            - generic [ref=e246]: "{}"
        - row "rack.request.form_pairs []" [ref=e247]:
          - cell "rack.request.form_pairs" [ref=e248]
          - cell "[]" [ref=e249]:
            - generic [ref=e250]: "[]"
        - 'row "rack.request.query_hash {}" [ref=e251]':
          - cell "rack.request.query_hash" [ref=e252]
          - 'cell "{}" [ref=e253]':
            - generic [ref=e254]: "{}"
        - row "rack.response_finished []" [ref=e255]:
          - cell "rack.response_finished" [ref=e256]
          - cell "[]" [ref=e257]:
            - generic [ref=e258]: "[]"
        - row "rack.run_once false" [ref=e259]:
          - cell "rack.run_once" [ref=e260]
          - cell "false" [ref=e261]:
            - generic [ref=e262]: "false"
        - row "rack.url_scheme http" [ref=e263]:
          - cell "rack.url_scheme" [ref=e264]
          - cell "http" [ref=e265]:
            - generic [ref=e266]: http
        - row "rack.version [1, 6]" [ref=e267]:
          - cell "rack.version" [ref=e268]
          - cell "[1, 6]" [ref=e269]:
            - generic [ref=e270]: "[1, 6]"
        - row [ref=e271]:
          - cell "sinatra.accept" [ref=e272]
          - cell [ref=e273]:
            - generic [ref=e274]: "[#<Sinatra::Request::AcceptEntry:0x00000001251fcc70 @entry=\"text/html\", @type=\"text/html\", @params={}, @q=1.0>, #<Sinatra::Request::AcceptEntry:0x00000001251fcbd0 @entry=\"application/xhtml+xml\", @type=\"application/xhtml+xml\", @params={}, @q=1.0>, #<Sinatra::Request::AcceptEntry:0x00000001251fc900 @entry=\"image/avif\", @type=\"image/avif\", @params={}, @q=1.0>, #<Sinatra::Request::AcceptEntry:0x00000001251fc860 @entry=\"image/webp\", @type=\"image/webp\", @params={}, @q=1.0>, #<Sinatra::Request::AcceptEntry:0x00000001251fc7c0 @entry=\"image/apng\", @type=\"image/apng\", @params={}, @q=1.0>, #<Sinatra::Request::AcceptEntry:0x00000001251fcae0 @entry=\"application/xml;q=0.9\", @type=\"application/xml\", @params={}, @q=0.9>, #<Sinatra::Request::AcceptEntry:0x00000001251fc720 @entry=\"*/*;q=0.8\", @type=\"*/*\", @params={}, @q=0.8>, #<Sinatra::Request::AcceptEntry:0x00000001251fc5e0 @entry=\"application/signed-exchange;v=b3;q=0.7\", @type=\"application/signed-exchange\", @params={\"v\" => \"b3\"}, @q=0.7>]"
        - row "sinatra.commonlogger true" [ref=e275]:
          - cell "sinatra.commonlogger" [ref=e276]
          - cell "true" [ref=e277]:
            - generic [ref=e278]: "true"
        - 'row "sinatra.error #<NameError: undefined local variable or method ''null'' for class Item>" [ref=e279]':
          - cell "sinatra.error" [ref=e280]
          - 'cell "#<NameError: undefined local variable or method ''null'' for class Item>" [ref=e281]':
            - generic [ref=e282]: "#<NameError: undefined local variable or method 'null' for class Item>"
        - 'row "sinatra.error.params {}" [ref=e283]':
          - cell "sinatra.error.params" [ref=e284]
          - 'cell "{}" [ref=e285]':
            - generic [ref=e286]: "{}"
  - paragraph [ref=e287]:
    - text: You're seeing this error because you have enabled the
    - code [ref=e288]: show_exceptions
    - text: setting.
```

# Test source

```ts
  1  | import fs from 'node:fs/promises'
  2  | import path from 'node:path'
  3  | import { test, expect } from '../../e2e/__setup__.js'
  4  | 
  5  | const appRoot = path.resolve(process.cwd(), '..')
  6  | const dataDir = path.join(appRoot, 'data')
  7  | 
  8  | 
  9  | test('l’application démarre correctement', async ({ page }) => {
  10 |   page.on('pageerror', error => console.error(error))
  11 | 
  12 |   console.log('\n-> destruction du dossier data')
  13 |   await fs.rm(
  14 |     dataDir,
  15 |     { recursive: true, force: true }
  16 |   )
  17 | 
  18 |   await page.goto('/')
> 19 |   await expect(page.locator('#main-panel')).toHaveCount(1)
     |                                             ^ Error: expect(locator).toHaveCount(expected) failed
  20 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  21 |   await expect(page.locator('.project-list')).toHaveCount(1)
  22 |   await expect(page.locator('.project-item')).toHaveCount(1)
  23 |   await expect(page.locator('.project-item').nth(0)).toContainText('Projet modèle')
  24 | 
  25 | })
```