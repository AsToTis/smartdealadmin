const fs = require('fs');
const path = 'C:\\smartdeal\\smart-deal-app\\src\\app\\(tabs)\\index.tsx';

let content = fs.readFileSync(path, 'utf8');

const badBlock = `                ))}
              </ScrollView>
            ) : null}
          </View>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (`;

const goodBlock = `                ))}
              </ScrollView>
            ) : (`;

if (content.includes(badBlock)) {
    content = content.replace(badBlock, goodBlock);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Fixed syntax error in index.tsx');
} else {
    // Let's try to find it with regex if spacing is different
    const regex = /\) : null\}\s*<\/View>\s*<\/ImageBackground>\s*<\/TouchableOpacity>\s*\)\)\}\s*<\/ScrollView>\s*\) : \(/;
    if (regex.test(content)) {
        content = content.replace(regex, ') : (');
        fs.writeFileSync(path, content, 'utf8');
        console.log('Fixed syntax error in index.tsx via regex');
    } else {
        console.log('Could not find the exact block to fix');
    }
}