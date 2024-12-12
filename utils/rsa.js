import { JSEncrypt } from 'jsencrypt'
const publicKey = `
-----BEGIN RSA PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDO2iqEj93ld8ObiKH/HkzkU+gs
DGR5T91XcAsyBGEMMX64wdSk6IBGiKLSulqwldot7JoAbd7P2JkEeaZdRPjHA2jO
uhvuX98LneWZqo+kHP6ii0PNZEY1N+9RSI/OJVZ3e0qfuncxe2dVax2yDR19IDL2
1v7T1C/DlC97r1uLbwIDAQAB
-----END RSA PUBLIC KEY-----
`

export function Encrypt(data = '') {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(data);
    return encrypted
}
